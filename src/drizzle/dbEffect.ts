// drizzle and db access
import { db } from "@/drizzle/db";

// services, features, and other libraries
import { Cause, Context, Data, Effect, Exit, Layer, Option, Runtime } from "effect";

// types
import type { DbOrTx } from "@/drizzle/db";

// Define a domain error for the database
class DatabaseError extends Data.TaggedError("DatabaseError")<{ readonly message: string; readonly cause?: unknown }> {}

// Internal error to signal Drizzle to rollback
class RollbackSentinel {
  constructor(public cause: Cause.Cause<unknown>) {}
}

// The tag representing the transaction context
class TransactionContext extends Context.Tag("TransactionContext")<TransactionContext, DbOrTx>() {}

// The database service that acts as our bridge
export class DB extends Effect.Service<DB>()("DB", {
  dependencies: [Layer.succeed(TransactionContext, db)],

  effect: Effect.gen(function* () {
    // We only need the runtime to execute promises inside drizzle's callback
    const runtime = yield* Effect.runtime<TransactionContext>();
    const runPromiseExit = Runtime.runPromiseExit(runtime);

    // Executes a drizzle query and automatically detects if we are in a transaction context
    const execute = <A>(promise: (dbOrTx: DbOrTx) => Promise<A>) =>
      Effect.serviceOption(TransactionContext).pipe(
        Effect.map(Option.getOrElse(() => db)),
        Effect.flatMap((dbOrTx) => dbEffect(dbOrTx, promise)),
      );

    // Run the provided effect within a transaction context
    const transaction = <A, E, R extends TransactionContext>(effect: Effect.Effect<A, E, R>) =>
      Effect.async<A, E | DatabaseError, R>((resume) => {
        db.transaction(async (tx) => {
          const exit = await runPromiseExit(Effect.provideService(effect, TransactionContext, tx));

          Exit.match(exit, {
            // On success, resume with the value
            onSuccess: (value) => resume(Effect.succeed(value)),
            onFailure: (cause) => {
              // On failure, determine if it is a recoverable error or defect
              if (Cause.isFailure(cause)) {
                // Recoverable error, resume with failure
                resume(Effect.fail(Cause.originalError(cause) as E));
              } else {
                // Defect (non-recoverable), resume with a die
                resume(Effect.die(cause));
              }
              // Throw to rollback the transaction
              throw new RollbackSentinel(cause);
            },
          });
        }).catch((error) => {
          // If it is our sentinel, the effect has already been resumed – just ignore
          if (error instanceof RollbackSentinel) return;

          // Otherwise, wrap real DB/connection errors as a DatabaseError
          resume(Effect.fail(new DatabaseError({ message: String(error), cause: error })));
        });
      });

    return { db, execute, transaction } as const;
  }),
}) {}

// Executes the provided promise that expects a db/tx and supplies that db/tx to it
const dbEffect = <A>(dbOrTx: DbOrTx, promise: (dbOrTx: DbOrTx) => Promise<A>) =>
  Effect.tryPromise({
    try: () => promise(dbOrTx),
    catch: (error) => new DatabaseError({ message: String(error), cause: error }),
  });

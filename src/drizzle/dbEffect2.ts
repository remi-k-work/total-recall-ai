// drizzle and db access
import { db } from "@/drizzle/db";

// services, features, and other libraries
import { Cause, Context, Data, Effect, Exit, Layer, Option, Runtime } from "effect";

// types
import type { DbOrTx } from "@/drizzle/db";

// Define a domain error for the database
class DatabaseError extends Data.TaggedError("DatabaseError")<{ message: string; cause?: unknown }> {}

// Internal error to signal Drizzle to rollback
class RollbackSentinel {
  constructor(public cause: unknown) {}
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

    // Executes the provided promise that expects a db/tx and supplies that db/tx to it
    const dbEffect = <A>(dbOrTx: DbOrTx, promise: (dbOrTx: DbOrTx) => Promise<A>) =>
      Effect.tryPromise({
        try: () => promise(dbOrTx),
        catch: (error) => new DatabaseError({ message: String(error), cause: error }),
      });

    // Executes a drizzle query and automatically detects if we are in a transaction context
    const execute = <A>(promise: (dbOrTx: DbOrTx) => Promise<A>) =>
      Effect.gen(function* () {
        const tx = yield* Effect.serviceOption(TransactionContext);
        const dbOrTx = Option.isSome(tx) ? tx.value : db;
        return yield* dbEffect(dbOrTx, promise);
      });

    // Run the provided effect within a transaction context
    const transaction = <A, E, R extends TransactionContext>(effect: Effect.Effect<A, E, R>) =>
      Effect.async<A, E | DatabaseError, R>((resume) => {
        db.transaction(async (tx) => {
          const result = await runPromiseExit(Effect.provideService(effect, TransactionContext, tx));

          Exit.match(result, {
            onSuccess: (value) => resume(Effect.succeed(value)),
            onFailure: (cause) => {
              if (Cause.isFailure(cause)) {
                resume(Effect.fail(Cause.originalError(cause) as E));
              } else {
                resume(Effect.die(cause));
              }
              // If the effect failed, we must throw to tell drizzle to rollback
              throw new RollbackSentinel(result);
            },
          });
        }).catch((error) => {
          // Ignore our own sentinel (the rollback was successful)
          if (error instanceof RollbackSentinel) return;

          // Handle actual db/connection errors (e.g., "commit failed")
          resume(Effect.fail(new DatabaseError({ message: String(error), cause: error })));
        });
      });

    return { db, execute, transaction } as const;
  }),
}) {}

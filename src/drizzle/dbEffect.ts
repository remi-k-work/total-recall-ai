// drizzle and db access
import { db } from "@/drizzle/db";

// services, features, and other libraries
import { Context, Data, Effect, Exit, Layer, Runtime } from "effect";

// types
import type { DbOrTx } from "@/drizzle/db";

// Define a domain error for the database
export class DatabaseError extends Data.TaggedError("DatabaseError")<{ message: string; cause?: unknown }> {}

// Internal error to signal Drizzle to rollback
class RollbackSentinel {
  constructor(public cause: unknown) {}
}

// The tag representing the current database context (db or tx)
export class DbOrTxContext extends Context.Tag("DbOrTxContext")<DbOrTxContext, DbOrTx>() {}

// The database service that acts as our bridge
export class DB extends Effect.Service<DB>()("DB", {
  dependencies: [Layer.succeed(DbOrTxContext, db)],

  effect: Effect.gen(function* () {
    // Get the current database context (db or tx)
    const dbOrTxContext = yield* DbOrTxContext;

    // We only need the runtime to execute promises inside Drizzle's callback
    const runtime = yield* Effect.runtime<DbOrTxContext>();
    const runPromiseExit = Runtime.runPromiseExit(runtime);

    return {
      // Expose the current database context
      db: dbOrTxContext,

      // Executes a drizzle query within the current effect context
      execute: <A>(promise: (dbOrTx: DbOrTx) => Promise<A>) =>
        Effect.flatMap(DbOrTxContext, (dbOrTx) =>
          Effect.tryPromise({
            try: () => promise(dbOrTx),
            catch: (error) => new DatabaseError({ message: String(error), cause: error }),
          }),
        ),

      // execute: <A>(promise: (dbOrTx: DbOrTx) => Promise<A>) =>
      //   Effect.tryPromise({
      //     try: () => promise(dbOrTxContext),
      //     catch: (error) => new DatabaseError({ message: String(error), cause: error }),
      //   }),

      // 2. TRANSACTION WRAPPER: Handles error unwrapping and nested contexts
      transaction: <A, E, R extends DbOrTxContext>(self: Effect.Effect<A, E, R>) =>
        Effect.flatMap(DbOrTxContext, (currentDb) =>
          Effect.async<A, E | DatabaseError, R>((resume) => {
            currentDb
              .transaction(async (tx) => {
                // Run the effect with the NEW transaction context
                const result = await runPromiseExit(Effect.provideService(self, DbOrTxContext, tx));

                if (Exit.isSuccess(result)) {
                  resume(Effect.succeed(result.value));
                } else {
                  // If the effect failed, we must THROW to tell Drizzle to rollback.
                  // We wrap the failure in a specific Sentinel so we can catch it outside.
                  resume(result); // Pass the failure to the Effect flow
                  throw new RollbackSentinel(result);
                }
              })
              .catch((error) => {
                // Ignore our own sentinel (the rollback was successful)
                if (error instanceof RollbackSentinel) return;

                // Handle actual DB/Connection errors (e.g. "Commit failed")
                resume(Effect.fail(new DatabaseError({ message: String(error), cause: error })));
              });
          }),
        ),

      // This transaction wrapper changes the current database context to a transaction on the fly
      // transaction: <A, E, R extends DbOrTxContext>(self: Effect.Effect<A, E, R>) =>
      //   Effect.tryPromise({
      //     try: () =>
      //       dbOrTxContext.transaction(async (tx) => {
      //         const effectWithTx = Effect.provideService(self, DbOrTxContext, tx);
      //         return await runPromise(effectWithTx);
      //       }),
      //     catch: (error) => new DatabaseError({ message: String(error), cause: error }),
      //   }),
    };
  }),
}) {}

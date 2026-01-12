// services, features, and other libraries
import { Effect } from "effect";
import { DatabaseError } from "./dbEffect";

// Centralize the tryPromise wrapper
export const dbEffect = <A>(promise: () => Promise<A>) =>
  Effect.tryPromise({
    try: promise,
    catch: (error) => new DatabaseError({ message: String(error), cause: error }),
  });

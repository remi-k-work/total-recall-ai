// services, features, and other libraries
import { Data, Effect, Schema } from "effect";

// types
interface PageInputPromises {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// Define a domain error for the invalid page inputs
class InvalidPageInputsError extends Data.TaggedError("InvalidPageInputsError")<{ readonly message: string; readonly cause?: unknown }> {}

// Safely validate next.js route inputs (`params` and `searchParams`) against a schema; return typed data or trigger a 404 on failure
export const validatePageInputs = <A, I>(schema: Schema.Schema<A, I>, { params, searchParams }: PageInputPromises) =>
  Effect.gen(function* () {
    const [p, sp] = yield* Effect.all([Effect.promise(() => params), Effect.promise(() => searchParams)], { concurrency: 2 });
    return yield* Schema.decodeUnknown(schema)({ params: p, searchParams: sp }).pipe(
      Effect.mapError((cause) => new InvalidPageInputsError({ message: "Invalid page inputs", cause })),
    );
  });

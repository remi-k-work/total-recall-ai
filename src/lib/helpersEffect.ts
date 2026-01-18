/* eslint-disable @typescript-eslint/no-explicit-any */

// next
import { connection } from "next/server";
import { notFound, unauthorized } from "next/navigation";

// services, features, and other libraries
import { Console, Data, Effect, Either, Schema } from "effect";
import { RuntimeServer } from "@/lib/RuntimeServer";

// types
interface PageInputPromises {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// Define a domain error for invalid page inputs and situations where an item is not found
class InvalidPageInputsError extends Data.TaggedError("InvalidPageInputsError")<{ readonly message: string; readonly cause?: unknown }> {}
export class ItemNotFoundError extends Data.TaggedError("ItemNotFoundError")<{ readonly message: string; readonly cause?: unknown }> {}

// Safely validate next.js route inputs (`params` and `searchParams`) against a schema; return typed data or trigger a 404 on failure
export const validatePageInputs = <A, I>(schema: Schema.Schema<A, I>, { params, searchParams }: PageInputPromises) =>
  Effect.gen(function* () {
    const [p, sp] = yield* Effect.all([Effect.promise(() => params), Effect.promise(() => searchParams)], { concurrency: 2 });
    return yield* Schema.decodeUnknown(schema)({ params: p, searchParams: sp }).pipe(
      Effect.mapError((cause) => new InvalidPageInputsError({ message: "Invalid page inputs", cause })),
    );
  });

// Execute the main effect for the page, map known errors to the subsequent navigation helpers, and return the payload
export const runPageMainOrNavigate = async <A, E extends { _tag: string }>(pageMain: Effect.Effect<A, E, any>) => {
  // Explicitly defer to request time (Effect uses Date.now() internally)
  await connection();

  // We wrap in Effect.either to catch failures gracefully
  const pageMainResult = await RuntimeServer.runPromise(
    pageMain.pipe(
      Effect.tapError((error) => Console.log(`[PAGE MAIN ERROR]: ${error}`)),
      Effect.either,
    ),
  );

  // Standardized error handling
  if (Either.isLeft(pageMainResult)) {
    const error = pageMainResult.left;

    if (error._tag === "InvalidPageInputsError") notFound();
    if (error._tag === "ItemNotFoundError") notFound();
    if (error._tag === "UnauthorizedAccessError") unauthorized();

    // Allow the next.js error boundary to catch any unexpected errors
    throw error;
  } else {
    // Return success result
    return pageMainResult.right;
  }
};

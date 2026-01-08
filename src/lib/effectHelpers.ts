// next
import { notFound } from "next/navigation";

// services, features, and other libraries
import { Effect, Schema } from "effect";

// types
interface PageInputPromises {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// Safely validate next.js route inputs (`params` and `searchParams`) against a zod schema; return typed data or trigger a 404 on failure
export const validatePageInputs = <A, I>(schema: Schema.Schema<A, I>, { params, searchParams }: PageInputPromises) => {
  return Effect.gen(function* () {
    // 1. Unwrap the Next.js promises in parallel
    // We use Effect.promise to bridge the async world into Effect
    const [p, sp] = yield* Effect.all([Effect.promise(() => params), Effect.promise(() => searchParams)]);

    // 2. Decode against the schema
    // onExcessProperty: "ignore" ensures ?utm_source=xyz doesn't crash the page
    const data = yield* Schema.decodeUnknown(schema)({ params: p, searchParams: sp });

    return data;
  }).pipe(
    // 3. Error Handling
    // If validation fails, we log it (optional) and trigger Next.js notFound
    Effect.catchTag("ParseError", () => {
      return Effect.sync(() => notFound());
    }),

    // 4. Execution
    // Since Server Components are async, we run the Effect as a Promise
    Effect.runPromise,
  );
};

// next
import { notFound } from "next/navigation";

// services, features, and other libraries
import { Effect, Schema } from "effect";
import { RuntimeServer } from "@/lib/RuntimeServer";

// types
interface PageInputPromises {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// Safely validate next.js route inputs (`params` and `searchParams`) against a schema; return typed data or trigger a 404 on failure
export const validatePageInputs = async <A, I>(schema: Schema.Schema<A, I>, { params, searchParams }: PageInputPromises) => {
  const effect = Effect.gen(function* () {
    const [p, sp] = yield* Effect.all([Effect.promise(() => params), Effect.promise(() => searchParams)], { concurrency: 2 });
    return yield* Schema.decodeUnknown(schema)({ params: p, searchParams: sp });
  });

  return RuntimeServer.runPromise(effect).catch(notFound);
};

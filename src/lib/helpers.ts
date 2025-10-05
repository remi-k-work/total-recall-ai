// next
import { notFound } from "next/navigation";

// services, features, and other libraries
import { z } from "zod";

// types
interface PageInputPromises {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// Safely validate next.js route inputs (`params` and `searchParams`) against a zod schema; return typed data or trigger a 404 on failure
export async function validatePageInputs<T extends z.ZodTypeAny>(schema: T, data: PageInputPromises): Promise<z.infer<T>> {
  // Await both in parallel for performance
  const [params, searchParams] = await Promise.all([data.params, data.searchParams]);

  const result = schema.safeParse({ params, searchParams });
  if (!result.success) notFound();

  return result.data;
}

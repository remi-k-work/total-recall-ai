// next
import { notFound } from "next/navigation";
import { createServerValidate } from "@tanstack/react-form/nextjs";

// services, features, and other libraries
import { z } from "zod";

// types
interface PageInputPromises {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// Safely validate next.js route inputs (`params` and `searchParams`) against a zod schema; return typed data or trigger a 404 on failure
export async function validatePageInputs<TSchema extends z.ZodTypeAny>(schema: TSchema, data: PageInputPromises): Promise<z.infer<TSchema>> {
  // Await both in parallel for performance
  const [params, searchParams] = await Promise.all([data.params, data.searchParams]);

  const result = schema.safeParse({ params, searchParams });
  if (!result.success) notFound();

  return result.data;
}

// A custom wrapper for createServerValidate that applies zod transformations
export function createServerValidateWithTransforms<TSchema extends z.ZodTypeAny>(DEFAULT_VALUES: z.input<TSchema>, schema: TSchema) {
  const SERVER_VALIDATE = createServerValidate({ defaultValues: DEFAULT_VALUES, onServerValidate: schema });

  return async (formData: FormData): Promise<z.output<TSchema>> => {
    // Validate the form on the server side (it will throw if validation fails)
    await SERVER_VALIDATE(formData);

    // Validation has passed, return the parsed form data (ensures that zod transformations like "trim()" are applied)
    return schema.parseAsync(Object.fromEntries(formData.entries()));
  };
}

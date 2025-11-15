// next
import { notFound } from "next/navigation";
import { createServerValidate } from "@tanstack/react-form-nextjs";

// services, features, and other libraries
import { z } from "zod";

// types
interface PageInputPromises {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

interface RouteHandlerInputs {
  params: Record<string, string>;
  searchParams: URLSearchParams;
}

// Safely validate next.js route inputs (`params` and `searchParams`) against a zod schema; return typed data or trigger a 404 on failure
export async function validatePageInputs<TSchema extends z.ZodTypeAny>(schema: TSchema, data: PageInputPromises): Promise<z.infer<TSchema>> {
  // Await both in parallel for performance
  const [params, searchParams] = await Promise.all([data.params, data.searchParams]);

  const result = schema.safeParse({ params, searchParams });
  if (!result.success) notFound();

  return result.data;
}

// For route handlers — validates params and searchParams, throws 404 if invalid
export function validateRouteInputs<TSchema extends z.ZodTypeAny>(schema: TSchema, data: RouteHandlerInputs): z.infer<TSchema> {
  // Convert URLSearchParams → object
  const searchParamsObj = Object.fromEntries(data.searchParams.entries());

  const result = schema.safeParse({ params: data.params, searchParams: searchParamsObj });
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

// Get a robohash avatar url for a user
export function getUserAvatarUrl(sessionId?: string) {
  return `https://robohash.org/${sessionId ?? getRandomSeed()}.png?set=set${sessionId ? (hashStringToNumber(sessionId) % 5) + 1 : getRandomInt(1, 5)}`;
}

// Get the initials from a name
export function getInitialsFromName(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Add a delay for a certain time in milliseconds
export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Generate a random integer between min and max (inclusive)
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a random 3-character alphanumeric seed (A–Z, 0–9)
function getRandomSeed(length = 3) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) result += chars.charAt(getRandomInt(0, chars.length - 1));

  return result;
}

// Simple deterministic hash -> number
function hashStringToNumber(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32-bit int
  }

  return Math.abs(hash);
}

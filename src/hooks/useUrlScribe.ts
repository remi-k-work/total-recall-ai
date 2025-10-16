// react
import { useCallback } from "react";

// next
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// types
import type { Route } from "next";

// Define a more convenient type for the params object
type QueryParams = Record<string, string | number>;

// A hook to easily create new route strings with updated search parameters (it preserves existing search params)
export default function useUrlScribe() {
  // Access next.js routing utilities
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Builds a new href string by adding/updating the provided search params
  const createHref = useCallback(
    (paramsToSet: QueryParams): Route => {
      // Create a mutable copy of the current search params
      const params = new URLSearchParams(searchParams.toString());

      // Set or update each parameter from the input object
      for (const [key, value] of Object.entries(paramsToSet)) params.set(key, String(value));

      return `${pathname}?${params.toString()}` as Route;
    },
    [pathname, searchParams],
  );

  // Programmatically navigates to a new url with updated search params
  const navigate = useCallback((paramsToSet: QueryParams) => router.push(createHref(paramsToSet)), [router, createHref]);

  return { createHref, navigate };
}

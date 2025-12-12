// react
import { useCallback } from "react";

// next
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// types
import type { Route } from "next";

// Define a more convenient type for the params object
type QueryValue = string | number | (string | number)[];
type QueryParams = Record<string, QueryValue>;

// A hook to easily create new route strings with updated search parameters (it preserves existing search params)
export default function useUrlScribe() {
  // Access next.js routing utilities
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Builds a new href string by adding/updating the provided search params
  const createHref = useCallback(
    (paramsToSet?: QueryParams, newRoute?: Route): Route => {
      // Create a mutable copy of the current search params
      const params = new URLSearchParams(searchParams.toString());

      // Only modify params if an object was provided
      if (paramsToSet) {
        // Set or update each parameter from the input object
        for (const [key, value] of Object.entries(paramsToSet)) {
          if (Array.isArray(value)) params.set(key, value.join(","));
          else params.set(key, String(value));
        }
      }

      return `${newRoute ?? pathname}?${params.toString()}` as Route;
    },
    [pathname, searchParams],
  );

  // Programmatically navigates to a new url with updated search params
  const navigate = useCallback((paramsToSet?: QueryParams, newRoute?: Route) => router.push(createHref(paramsToSet, newRoute)), [router, createHref]);

  return { createHref, navigate };
}

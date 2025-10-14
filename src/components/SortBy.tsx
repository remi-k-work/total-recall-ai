"use client";

// react
import { useCallback } from "react";

// next
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

// components
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// assets
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from "@heroicons/react/24/outline";

// types
type SortByField = (typeof SORT_BY_FIELDS)[number];

interface SortByProps {
  currentField: SortByField[0];
  totalPages: number;
  sortByFields: readonly SortByField[];
}

// constants
export const SORT_BY_FIELDS = [
  ["created_at", <ArrowLeftCircleIcon key="created_at" className="h-4 w-4" />],
  ["updated_at", <ArrowRightCircleIcon key="updated_at" className="h-4 w-4" />],
] as const;

export default function SortBy({ currentField, totalPages, sortByFields }: SortByProps) {
  // Access the current route's pathname and query parameters
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Build a new href with the provided search params while preserving existing ones
  const buildNewHref = useCallback(
    (currentField: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("s", currentField);

      return `${pathname}?${params.toString()}` as __next_route_internal_types__.RouteImpl<string>;
    },
    [searchParams, pathname],
  );

  // Skip rendering if there is only one or zero pages
  if (totalPages <= 1) return null;

  return (
    <ToggleGroup type="single" defaultValue={currentField}>
      {sortByFields.map(([field, icon]) => (
        <ToggleGroupItem key={field} value={field} aria-label={`Sort by ${field}`} title={`Sort by ${field}`}>
          <Link href={buildNewHref(field)} className="flex items-center gap-2">
            {icon}
            {field}
          </Link>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

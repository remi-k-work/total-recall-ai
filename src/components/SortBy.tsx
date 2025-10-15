"use client";

// react
import { useCallback } from "react";

// next
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// components
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/custom/toggle-group";
import { Label } from "@/components/ui/custom/label";
import { Switch } from "@/components/ui/custom/switch";

// assets
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from "@heroicons/react/24/outline";

// types
interface SortByProps {
  totalPages: number;
  sortByFields: (keyof typeof FIELD_ICONS)[];
  currentField: keyof typeof FIELD_ICONS;
  currentDirection: "asc" | "desc";
}

// constants
const FIELD_ICONS = {
  created_at: <ArrowLeftCircleIcon className="size-9" />,
  updated_at: <ArrowRightCircleIcon className="size-9" />,
} as const;

const FIELD_LABELS = {
  created_at: "Created",
  updated_at: "Updated",
} as const;

export default function SortBy({ totalPages, sortByFields, currentField, currentDirection }: SortByProps) {
  // Access the current route's pathname and query parameters
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Build a new href with the provided search params while preserving existing ones
  const buildNewHref = useCallback(
    (paramsToSet: [string, string][]) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of paramsToSet) params.set(key, value);
      return `${pathname}?${params.toString()}` as __next_route_internal_types__.RouteImpl<string>;
    },
    [searchParams, pathname],
  );

  // Skip rendering if there is only one or zero pages
  if (totalPages <= 1) return null;

  return (
    <>
      <ToggleGroup type="single" defaultValue={currentField}>
        {sortByFields.map((field) => (
          <ToggleGroupItem key={field} value={field} aria-label={`Sort By ${FIELD_LABELS[field]}`} title={`Sort By ${FIELD_LABELS[field]}`}>
            <Link href={buildNewHref([["sf", field]])} className="flex flex-col items-center">
              {FIELD_ICONS[field]}
              {FIELD_LABELS[field]}
            </Link>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Label className="flex items-center gap-2">
        DESC
        <Switch
          name="sortDirection"
          defaultChecked={currentDirection === "asc"}
          onCheckedChange={(isAscending) => {
            router.push(buildNewHref([["sd", isAscending ? "asc" : "desc"]]));
          }}
        />
        ASC
      </Label>
    </>
  );
}

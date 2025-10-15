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
import { CalendarIcon, LanguageIcon } from "@heroicons/react/24/outline";

// types
interface SortByProps {
  totalPages: number;
  sortByFields: (keyof typeof FIELD_ICONS)[];
  currentField: keyof typeof FIELD_ICONS;
  currentDirection: "asc" | "desc";
}

// constants
const FIELD_ICONS = {
  created_at: <CalendarIcon className="size-9" />,
  updated_at: <CalendarIcon className="size-9" />,
  title: <LanguageIcon className="size-9" />,
} as const;

const FIELD_LABELS = {
  created_at: "Created At",
  updated_at: "Updated At",
  title: "Note Title",
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

  // Skip rendering if there is no pages
  if (totalPages === 0) return null;

  return (
    <section className="flex items-center gap-2">
      <ToggleGroup type="single" defaultValue={currentField} className="items-start">
        {sortByFields.map((field) => (
          <ToggleGroupItem
            key={field}
            value={field}
            aria-label={`Sort By: ${FIELD_LABELS[field]}`}
            title={`Sort By: ${FIELD_LABELS[field]}`}
            className="gap-0"
            asChild
          >
            <Link href={buildNewHref([["sf", field]])} className="flex-col">
              {FIELD_ICONS[field]}
              <p className="text-center font-sans text-sm whitespace-pre-line">{FIELD_LABELS[field].replaceAll(" ", "\n")}</p>
            </Link>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Label className="flex items-center border px-3 font-normal">
        DESC<span className="text-muted-foreground mr-1 text-3xl">▽</span>
        <Switch
          name="sortDirection"
          aria-label="Sort Direction"
          title="Sort Direction"
          defaultChecked={currentDirection === "asc"}
          onCheckedChange={(isAscending) => {
            router.push(buildNewHref([["sd", isAscending ? "asc" : "desc"]]));
          }}
        />
        <span className="text-muted-foreground ml-1 text-3xl">△</span>ASC
      </Label>
    </section>
  );
}

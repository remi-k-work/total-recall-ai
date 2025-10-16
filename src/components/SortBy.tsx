"use client";

// next
import Link from "next/link";

// services, features, and other libraries
import useUrlScribe from "@/hooks/useUrlScribe";

// components
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/custom/toggle-group";
import { Label } from "@/components/ui/custom/label";
import { Switch } from "@/components/ui/custom/switch";

// assets
import { CalendarIcon, LanguageIcon } from "@heroicons/react/24/outline";

// types
export interface SortField {
  key: string;
  label: string;
  iconKey: keyof typeof ICON_MAP;
}

interface SortByProps {
  totalPages: number;
  fields: SortField[];
  currentField: string;
  currentDirection: "asc" | "desc";
}

// constants
const ICON_MAP = {
  calendar: <CalendarIcon className="size-9" />,
  language: <LanguageIcon className="size-9" />,
} as const;

export default function SortBy({ totalPages, fields, currentField, currentDirection }: SortByProps) {
  // A hook to easily create new route strings with updated search parameters (it preserves existing search params)
  const { createHref, navigate } = useUrlScribe();

  // Skip rendering if there is no pages
  if (totalPages === 0) return null;

  return (
    <section className="flex items-center gap-2">
      <ToggleGroup type="single" defaultValue={currentField} className="items-start">
        {fields.map(({ key, label, iconKey }) => (
          <ToggleGroupItem key={key} value={key} aria-label={`Sort By: ${label}`} title={`Sort By: ${label}`} className="gap-0" asChild>
            <Link href={createHref({ sf: key })} className="flex-col">
              {ICON_MAP[iconKey]}
              <p className="text-center font-sans text-sm whitespace-pre-line">{label.replaceAll(" ", "\n")}</p>
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
          onCheckedChange={(isAscending) => navigate({ sd: isAscending ? "asc" : "desc" })}
        />
        <span className="text-muted-foreground ml-1 text-3xl">△</span>ASC
      </Label>
    </section>
  );
}

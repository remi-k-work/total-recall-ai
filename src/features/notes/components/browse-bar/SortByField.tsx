// react
import { useEffect, useState } from "react";

// next
import Link from "next/link";

// services, features, and other libraries
import { useBrowseBarContext } from "./context";

// components
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/custom/toggle-group";

// assets
import { CalendarIcon, LanguageIcon } from "@heroicons/react/24/outline";

// types
export interface SortField {
  key: string;
  label: string;
  iconKey: keyof typeof ICON_MAP;
}

// constants
const ICON_MAP = {
  language: <LanguageIcon className="size-11" />,
  calendar: <CalendarIcon className="size-11" />,
} as const;

export default function SortByField() {
  // Access the browse bar context and retrieve all necessary information
  const { totalPages, sortByFields, sortByField, createHref } = useBrowseBarContext("notes-root");

  // Currently selected sort by field
  const [currSortByField, setCurrSortByField] = useState(sortByField);

  // Keep the currently selected sort by field in sync with search params
  useEffect(() => {
    setCurrSortByField(sortByField);
  }, [sortByField]);

  return (
    <ToggleGroup type="single" className="items-start" value={currSortByField} onValueChange={setCurrSortByField}>
      {sortByFields.map(({ key, label, iconKey }) => (
        <ToggleGroupItem
          key={key}
          value={key}
          aria-label={`Sort By: ${label}`}
          title={`Sort By: ${label}`}
          disabled={totalPages <= 1}
          className="gap-0"
          asChild
        >
          {totalPages <= 1 ? (
            <div className="flex-col text-center font-sans whitespace-pre-line select-none">
              {ICON_MAP[iconKey]}
              {label.replaceAll(" ", "\n")}
            </div>
          ) : (
            <Link href={createHref({ sbf: key })} className="flex-col text-center font-sans whitespace-pre-line">
              {ICON_MAP[iconKey]}
              {label.replaceAll(" ", "\n")}
            </Link>
          )}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

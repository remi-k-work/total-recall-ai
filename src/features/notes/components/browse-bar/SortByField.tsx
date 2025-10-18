// next
import Link from "next/link";

// services, features, and other libraries
import { useBrowseBarContext } from "./Context";
import useUrlScribe from "@/hooks/useUrlScribe";

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
  calendar: <CalendarIcon className="size-11" />,
  language: <LanguageIcon className="size-11" />,
} as const;

export default function SortByField() {
  // Access the browse bar context and retrieve all necessary information
  const browseBarContext = useBrowseBarContext();

  // A hook to easily create new route strings with updated search parameters (it preserves existing search params)
  const { createHref } = useUrlScribe();

  // Render the sort by field only for the "notes root" kind
  if (browseBarContext.kind !== "notes-root") return null;
  const { totalPages, sortByFields, sortByField } = browseBarContext;

  return (
    <ToggleGroup type="single" defaultValue={sortByField} className="items-start">
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
            <div className="flex-col select-none">
              {ICON_MAP[iconKey]}
              <p className="text-center font-sans whitespace-pre-line">{label.replaceAll(" ", "\n")}</p>
            </div>
          ) : (
            <Link href={createHref({ sbf: key })} className="flex-col">
              {ICON_MAP[iconKey]}
              <p className="text-center font-sans whitespace-pre-line">{label.replaceAll(" ", "\n")}</p>
            </Link>
          )}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

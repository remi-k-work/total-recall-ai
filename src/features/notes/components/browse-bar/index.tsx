"use client";

// components
import { BrowseBarContext } from "./Context";
import Search from "./search";
import SortByField from "./SortByField";
import SortByDirection from "./SortByDirection";
import Paginate from "./Paginate";

// types
import type { SortField } from "./SortByField";
import type { BrowseBarContextType } from "./Context";

// constants
const NOTES_SORT_FIELDS: SortField[] = [
  { key: "created_at", label: "Created At", iconKey: "calendar" },
  { key: "updated_at", label: "Updated At", iconKey: "calendar" },
  { key: "title", label: "Note Title", iconKey: "language" },
] as const;

export default function BrowseBar(props: Omit<BrowseBarContextType, "searchRoute" | "sortByFields">) {
  return (
    <BrowseBarContext value={{ ...props, searchRoute: "/notes", sortByFields: NOTES_SORT_FIELDS }}>
      <section className="bg-card flex flex-wrap items-center justify-around gap-4 p-3">
        <Search />
        <SortByField />
        <div className="grid gap-2">
          <SortByDirection />
          <Paginate />
        </div>
      </section>
    </BrowseBarContext>
  );
}

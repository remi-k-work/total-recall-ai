"use client";

// components
import { BrowseBarContext } from "./Context";
import Search from "./search";
import SortBy from "./SortBy";
import Paginate from "./Paginate";

// types
import type { BrowseBarContextType } from "./Context";
import type { SortField } from "./SortBy";

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
        <SortBy />
        <Paginate />
      </section>
    </BrowseBarContext>
  );
}

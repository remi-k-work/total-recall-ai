"use client";

// components
import Search from "./Search2";
import FilterByTags from "./FilterByTags2";
import SortByField from "./SortByField2";
import SortByDirection from "./SortByDirection2";
import Paginate from "./Paginate2";
import ToolBar from "./ToolBar2";

// types
import type { BrowseBar } from "@/atoms";
import type { AvailNoteTags } from "@/features/notes/db";

interface BrowseBarProps {
  kind: "root" | "new" | "edit" | "details";
  borwseBar: BrowseBar;
  totalItems: number;
  totalPages: number;
  availNoteTags: AvailNoteTags;
}

export default function BrowseBar({ kind, borwseBar, totalItems, totalPages, availNoteTags }: BrowseBarProps) {
  return (
    <header className="flex flex-wrap items-center justify-around gap-4 bg-linear-to-b from-transparent via-secondary to-transparent px-3 py-6">
      {kind === "root" ? (
        <>
          <div className="grid gap-2">
            <Search kind={kind} borwseBar={borwseBar} totalItems={totalItems} />
            <FilterByTags borwseBar={borwseBar} availNoteTags={availNoteTags} />
          </div>
          <SortByField borwseBar={borwseBar} totalItems={totalItems} />
          <div className="grid gap-2">
            <SortByDirection borwseBar={borwseBar} totalItems={totalItems} />
            <Paginate borwseBar={borwseBar} totalPages={totalPages} />
          </div>
        </>
      ) : (
        <Search kind={kind} borwseBar={borwseBar} totalItems={totalItems} />
      )}
      <ToolBar kind={kind} />
    </header>
  );
}

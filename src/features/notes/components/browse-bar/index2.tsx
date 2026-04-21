"use client";

// components
import Search from "./Search2";
import FilterByTags from "./FilterByTags";
import SortByField from "./SortByField";
import SortByDirection from "./SortByDirection";
import Paginate from "./Paginate";
import ToolBar from "./ToolBar";

// types
import type { BrowseBar } from "@/atoms";

interface BrowseBarProps {
  kind: "root" | "new" | "edit" | "details";
  borwseBar: BrowseBar;
}

export default function BrowseBar({ kind, borwseBar }: BrowseBarProps) {
  return (
    <header className="flex flex-wrap items-center justify-around gap-4 bg-linear-to-b from-transparent via-secondary to-transparent px-3 py-6">
      {kind === "root" ? (
        <>
          <div className="grid gap-2">
            <Search />
            <FilterByTags />
          </div>
          <SortByField />
          <div className="grid gap-2">
            <SortByDirection />
            <Paginate />
          </div>
        </>
      ) : (
        <Search />
      )}
      <ToolBar />
    </header>
  );
}

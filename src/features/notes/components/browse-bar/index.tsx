"use client";

// components
import BrowseBarProvider from "./context";
import Search from "./search";
import FilterByTags from "./FilterByTags2";
import SortByField from "./SortByField";
import SortByDirection from "./SortByDirection";
import Paginate from "./Paginate";
import ToolBar from "./ToolBar";

// types
import type { BrowseBarProviderPropsWithoutChildren } from "./context/types";

export default function BrowseBar({ ...props }: BrowseBarProviderPropsWithoutChildren) {
  return (
    <BrowseBarProvider {...props}>
      <header className="via-secondary flex flex-wrap items-center justify-around gap-4 bg-linear-to-b from-transparent to-transparent px-3 py-6">
        {props.kind === "notes-root" ? (
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
    </BrowseBarProvider>
  );
}

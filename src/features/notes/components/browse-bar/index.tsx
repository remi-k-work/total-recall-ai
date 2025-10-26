"use client";

// components
import BrowseBarProvider from "./context";
import Search from "./search";
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
        <Search />
        {props.kind === "notes-root" && (
          <>
            <SortByField />
            <div className="grid gap-2">
              <SortByDirection />
              <Paginate />
            </div>
          </>
        )}
        <ToolBar />
      </header>
    </BrowseBarProvider>
  );
}

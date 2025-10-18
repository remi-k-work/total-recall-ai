"use client";

// components
import BrowseBarProvider from "./Context";
import Search from "./search";
import SortByField from "./SortByField";
import SortByDirection from "./SortByDirection";
import Paginate from "./Paginate";
import ToolBar from "./ToolBar";

// types
import type { BrowseBarProviderPropsWithoutChildren } from "./Context";

export default function BrowseBar(props: BrowseBarProviderPropsWithoutChildren) {
  return (
    <BrowseBarProvider {...props}>
      <section className="bg-card flex flex-wrap items-center justify-around gap-4 p-3">
        <Search />
        <SortByField />
        <div className="grid gap-2">
          <SortByDirection />
          <Paginate />
        </div>
        <ToolBar />
      </section>
    </BrowseBarProvider>
  );
}

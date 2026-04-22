"use client";

// components
import Search from "./Search";
import FilterByTags from "./FilterByTags";
import SortByField from "./SortByField";
import SortByDirection from "./SortByDirection";
import Paginate from "./Paginate";
import ToolBar from "./ToolBar";

// types
import type { BrowseBar } from "@/atoms";
import type { AvailNoteTags } from "@/features/notes/db";

interface Root {
  kind: "root";
  browseBar: Partial<BrowseBar>;
  totalItems: number;
  totalPages: number;
  availNoteTags: AvailNoteTags;
}

interface New {
  kind: "new";
  browseBar: Partial<BrowseBar>;
}

interface Rest {
  kind: "edit" | "details";
  browseBar: Partial<BrowseBar>;
  noteId: string;
}

type BrowseBarProps = Root | New | Rest;

// constants
import { INIT_BROWSE_BAR } from "@/atoms";

export default function BrowseBar(props: BrowseBarProps) {
  // Normalize the incoming browse bar state
  const { browseBar } = props;
  const incomingBrowseBar = { ...INIT_BROWSE_BAR, ...browseBar } as const;

  if (props.kind === "root") {
    const { kind, totalItems, totalPages, availNoteTags } = props;

    return (
      <header className="flex flex-wrap items-center justify-around gap-4 bg-linear-to-b from-transparent via-secondary to-transparent px-3 py-6">
        <div className="grid gap-2">
          <Search kind={kind} browseBar={incomingBrowseBar} totalItems={totalItems} />
          <FilterByTags browseBar={incomingBrowseBar} availNoteTags={availNoteTags} />
        </div>
        <SortByField browseBar={incomingBrowseBar} totalItems={totalItems} />
        <div className="grid gap-2">
          <SortByDirection browseBar={incomingBrowseBar} totalItems={totalItems} />
          <Paginate browseBar={incomingBrowseBar} totalPages={totalPages} />
        </div>
        <ToolBar kind={kind} />
      </header>
    );
  } else {
    if (props.kind === "details") {
      const { kind, noteId } = props;

      return (
        <header className="flex flex-wrap items-center justify-around gap-4 bg-linear-to-b from-transparent via-secondary to-transparent px-3 py-6">
          <Search kind={kind} browseBar={incomingBrowseBar} />
          <ToolBar kind={kind} noteId={noteId} />
        </header>
      );
    } else {
      const { kind } = props;

      return (
        <header className="flex flex-wrap items-center justify-around gap-4 bg-linear-to-b from-transparent via-secondary to-transparent px-3 py-6">
          <Search kind={kind} browseBar={incomingBrowseBar} />
          <ToolBar kind={kind} />
        </header>
      );
    }
  }
}

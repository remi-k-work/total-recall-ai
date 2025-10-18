// react
import { createContext, use } from "react";

// types
import type { Route } from "next";
import type { SortField } from "@/features/notes/components/browse-bar/SortByField";
import type { ReactNode } from "react";

interface NotesRoot {
  kind: "notes-root";
  totalItems: number;
  totalPages: number;
  searchRoute: Route;
  sortByFields: SortField[];
  sortByField: string;
  sortByDirection: "asc" | "desc";
  currentPage: number;
}

interface NoteDetails {
  kind: "note-details";
  searchRoute: Route;
}

type BrowseBarContextType = NotesRoot | NoteDetails;
export type BrowseBarProviderPropsWithoutChildren = Omit<NotesRoot, "searchRoute" | "sortByFields"> | Omit<NoteDetails, "searchRoute">;
type BrowseBarProviderProps = BrowseBarProviderPropsWithoutChildren & { children: ReactNode };

// constants
const NOTES_SORT_FIELDS: SortField[] = [
  { key: "created_at", label: "Created At", iconKey: "calendar" },
  { key: "updated_at", label: "Updated At", iconKey: "calendar" },
  { key: "title", label: "Note Title", iconKey: "language" },
] as const;

// To be able to pass props to all the children of this compound component
const BrowseBarContext = createContext<BrowseBarContextType | undefined>(undefined);

export function useBrowseBarContext(kind: "notes-root"): NotesRoot;
export function useBrowseBarContext(kind: "note-details"): NoteDetails;
export function useBrowseBarContext(kind?: undefined): BrowseBarContextType;
export function useBrowseBarContext(kind?: BrowseBarContextType["kind"]) {
  const ctx = use(BrowseBarContext);
  if (!ctx) throw new Error("useBrowseBarContext must be used within a BrowseBarProvider.");
  if (kind && ctx.kind !== kind) throw new Error(`Expected BrowseBarContext of kind "${kind}", but got "${ctx.kind}".`);

  return ctx;
}

export default function BrowseBarProvider(props: BrowseBarProviderProps) {
  if (props.kind === "notes-root")
    return <BrowseBarContext value={{ ...props, searchRoute: "/notes", sortByFields: NOTES_SORT_FIELDS }}>{props.children}</BrowseBarContext>;
  return <BrowseBarContext value={{ ...props, searchRoute: "/notes" }}>{props.children}</BrowseBarContext>;
}

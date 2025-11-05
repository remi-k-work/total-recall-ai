// react
import { createContext, use } from "react";

// next
import { useParams } from "next/navigation";

// services, features, and other libraries
import useUrlScribe from "@/hooks/useUrlScribe";

// types
import { Actions, BrowseBarContextType, BrowseBarProviderProps, NoteDetails, NoteEdit, NoteNew, NotesRoot } from "./types";

// constants
import { SORT_BY_FIELDS } from "./constants";

// To be able to pass props to all the children of this compound component
const BrowseBarContext = createContext<BrowseBarContextType | undefined>(undefined);

export function useBrowseBarContext(kind: "notes-root"): NotesRoot & Actions;
export function useBrowseBarContext(kind: "note-details"): NoteDetails & Actions;
export function useBrowseBarContext(kind: "note-new"): NoteNew & Actions;
export function useBrowseBarContext(kind: "note-edit"): NoteEdit & Actions;
export function useBrowseBarContext(kind?: undefined): BrowseBarContextType;
export function useBrowseBarContext(kind?: BrowseBarContextType["kind"]) {
  const ctx = use(BrowseBarContext);
  if (!ctx) throw new Error("useBrowseBarContext must be used within a BrowseBarProvider.");
  if (kind && ctx.kind !== kind) throw new Error(`Expected BrowseBarContext of kind "${kind}", but got "${ctx.kind}".`);

  return ctx;
}

export default function BrowseBarProvider(props: BrowseBarProviderProps) {
  // A hook to easily create new route strings with updated search parameters (it preserves existing search params)
  const { createHref, navigate } = useUrlScribe();
  const { id: noteId } = useParams<{ id: string }>();

  if (props.kind === "notes-root")
    return (
      <BrowseBarContext value={{ ...props, searchRoute: "/notes", sortByFields: SORT_BY_FIELDS, createHref, navigate }}>{props.children}</BrowseBarContext>
    );
  if (props.kind === "note-new") return <BrowseBarContext value={{ ...props, searchRoute: "/notes", createHref, navigate }}>{props.children}</BrowseBarContext>;
  return <BrowseBarContext value={{ ...props, searchRoute: "/notes", noteId, createHref, navigate }}>{props.children}</BrowseBarContext>;
}

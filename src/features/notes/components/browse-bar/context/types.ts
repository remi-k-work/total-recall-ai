// types
import type { Route } from "next";
import type { SortField } from "@/features/notes/components/browse-bar/SortByField";
import type { ReactNode } from "react";
import type useUrlScribe from "@/hooks/useUrlScribe";

export interface NotesRoot {
  kind: "notes-root";
  totalItems: number;
  totalPages: number;
  searchRoute: Route;
  searchTerm: string;
  sortByFields: SortField[];
  sortByField: string;
  sortByDirection: "asc" | "desc";
  currentPage: number;
}

export interface NoteDetails {
  kind: "note-details";
  searchRoute: Route;
  noteId: string;
}

export interface NoteNew {
  kind: "note-new";
  searchRoute: Route;
}

export interface NoteEdit {
  kind: "note-edit";
  searchRoute: Route;
  noteId: string;
}

export interface Actions {
  createHref: ReturnType<typeof useUrlScribe>["createHref"];
  navigate: ReturnType<typeof useUrlScribe>["navigate"];
}

export type BrowseBarContextType = (NotesRoot | NoteDetails | NoteNew | NoteEdit) & Actions;
export type BrowseBarProviderPropsWithoutChildren =
  | Omit<NotesRoot, "searchRoute" | "sortByFields">
  | Omit<NoteDetails, "searchRoute">
  | Omit<NoteNew, "searchRoute">
  | Omit<NoteEdit, "searchRoute">;
export type BrowseBarProviderProps = BrowseBarProviderPropsWithoutChildren & { children: ReactNode };

// react
import { createContext, use } from "react";

// types
import type { Route } from "next";
import type { SortField } from "@/features/notes/components/browse-bar/SortBy";

export interface BrowseBarContextType {
  totalItems: number;
  totalPages: number;
  searchRoute: Route;
  sortByFields: SortField[];
  sortByField: string;
  sortByDirection: "asc" | "desc";
  currentPage: number;
}

// To be able to pass props to all the children of this compound component
export const BrowseBarContext = createContext<BrowseBarContextType | undefined>(undefined);
export const useBrowseBarContext = () => use(BrowseBarContext)!;

// types
import type { SortField } from "@/features/notes/components/browse-bar/SortByField";

// constants
export const SORT_BY_FIELDS: SortField[] = [
  { key: "created_at", label: "Created At", iconKey: "calendar" },
  { key: "updated_at", label: "Updated At", iconKey: "calendar" },
  { key: "title", label: "Note Title", iconKey: "language" },
] as const;

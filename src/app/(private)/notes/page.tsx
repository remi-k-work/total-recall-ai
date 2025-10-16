// drizzle and db access
import { getNotesWithPagination } from "@/features/notes/db";

// services, features, and other libraries
import { validatePageInputs } from "@/lib/helpers";
import { NotesPageSchema } from "@/features/notes/schemas/notesPage";
import { getUserSessionData, makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";

// components
import ToolBar from "@/features/notes/components/ToolBar";
import Paginate from "@/components/Paginate";
import SortBy from "@/components/SortBy";
import Search from "@/components/search";
import NotesPreview from "@/features/notes/components/NotesPreview";

// types
import type { Metadata } from "next";
import type { SortField } from "@/components/SortBy";

// constants
const NOTES_SORT_FIELDS: SortField[] = [
  { key: "created_at", label: "Created At", iconKey: "calendar" },
  { key: "updated_at", label: "Updated At", iconKey: "calendar" },
  { key: "title", label: "Note Title", iconKey: "language" },
] as const;

export const metadata: Metadata = {
  title: "Total Recall AI ► Notes",
};

export default async function Page({ params, searchParams }: PageProps<"/notes">) {
  // Safely validate next.js route inputs (`params` and `searchParams`) against a zod schema; return typed data or trigger a 404 on failure
  const {
    searchParams: { cp: currentPage, sbf: sortByField, sbd: sortByDirection },
  } = await validatePageInputs(NotesPageSchema, { params, searchParams });

  // Make sure the current user is authenticated (the check runs on the server side)
  await makeSureUserIsAuthenticated();

  // Access the user session data from the server side
  const {
    user: { id: userId },
  } = (await getUserSessionData())!;

  // Retrieve all notes for a user, including only the essential fields, and shorten the content for preview purposes
  const { notes, totalPages, prevPage, nextPage } = await getNotesWithPagination(userId, currentPage, 1, sortByField, sortByDirection);

  return (
    <>
      <h1>Notes</h1>
      <p>Welcome back! Below are all your notes</p>
      <ToolBar />
      <Paginate totalPages={totalPages} currentPage={currentPage} prevPage={prevPage} nextPage={nextPage} />
      <SortBy totalPages={totalPages} fields={NOTES_SORT_FIELDS} currentField={sortByField} currentDirection={sortByDirection} />
      <Search action="/notes" />
      <NotesPreview notes={notes} />
    </>
  );
}

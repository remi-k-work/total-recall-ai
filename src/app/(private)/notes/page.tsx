// drizzle and db access
import { getNotesWithPagination } from "@/features/notes/db";

// services, features, and other libraries
import { validatePageInputs } from "@/lib/helpers";
import { NotesPageSchema } from "@/features/notes/schemas/notesPage";
import { getUserSessionData, makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";

// components
import ToolBar from "@/features/notes/components/ToolBar";
import NotesPreview from "@/features/notes/components/NotesPreview";

// types
import type { Metadata } from "next";

// constants
export const metadata: Metadata = {
  title: "Total Recall AI ► Notes",
};

export default async function Page({ params, searchParams }: PageProps<"/notes">) {
  // Safely validate next.js route inputs (`params` and `searchParams`) against a zod schema; return typed data or trigger a 404 on failure
  const {
    searchParams: { page },
  } = await validatePageInputs(NotesPageSchema, { params, searchParams });

  console.log(page);

  // Make sure the current user is authenticated (the check runs on the server side)
  await makeSureUserIsAuthenticated();

  // Access the user session data from the server side
  const {
    user: { id: userId },
  } = (await getUserSessionData())!;

  // Retrieve all notes for a user, including only the essential fields, and shorten the content for preview purposes
  const { notes } = await getNotesWithPagination(userId);

  return (
    <>
      <h1>Notes</h1>
      <p>Welcome back! Below are all your notes</p>
      <ToolBar />
      <NotesPreview notes={notes} />
    </>
  );
}

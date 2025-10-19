// next
import { notFound } from "next/navigation";
import Link from "next/link";

// drizzle and db access
import { getNote } from "@/features/notes/db";

// services, features, and other libraries
import { validatePageInputs } from "@/lib/helpers";
import { NoteDetailsPageSchema } from "@/features/notes/schemas/noteDetailsPage";
import { getUserSessionData, makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";

// components
import BrowseBar from "@/features/notes/components/browse-bar";
import NoteDetails from "@/features/notes/components/NoteDetails";

// types
import type { Metadata } from "next";

// constants
export const metadata: Metadata = {
  title: "Total Recall AI ► Note Details",
};

export default async function Page({ params, searchParams }: PageProps<"/notes/[id]">) {
  // Safely validate next.js route inputs (`params` and `searchParams`) against a zod schema; return typed data or trigger a 404 on failure
  const {
    params: { id: noteId },
  } = await validatePageInputs(NoteDetailsPageSchema, { params, searchParams });

  // Make sure the current user is authenticated (the check runs on the server side)
  await makeSureUserIsAuthenticated();

  // Access the user session data from the server side
  const {
    user: { id: userId },
  } = (await getUserSessionData())!;

  // Get a single note for a user
  const note = await getNote(noteId, userId);

  // If the note is not found, return a 404
  if (!note) notFound();

  return (
    <>
      <h1>Note Details</h1>
      <p>Below are all your note details</p>
      <BrowseBar kind="note-details" noteId={noteId} />
      <Link href={`/notes/${noteId}/edit`}>
        <NoteDetails note={note} />
      </Link>
    </>
  );
}

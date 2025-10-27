// next
import { notFound } from "next/navigation";

// drizzle and db access
import { getNote } from "@/features/notes/db";

// services, features, and other libraries
import { validatePageInputs } from "@/lib/helpers";
import { NoteDetailsPageSchema } from "@/features/notes/schemas/noteDetailsPage";
import { getUserSessionData, makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";

// components
import NoteModal from "@/features/notes/components/note-modal";
import BrowseBar from "@/features/notes/components/browse-bar";
import NoteDetails from "@/features/notes/components/NoteDetails";

// assets
import { DocumentIcon } from "@heroicons/react/24/outline";

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
    <NoteModal icon={<DocumentIcon className="size-11 flex-none" />} title={note.title} browseBar={<BrowseBar kind="note-details" noteId={noteId} />}>
      <NoteDetails note={note} inNoteModal />
    </NoteModal>
  );
}

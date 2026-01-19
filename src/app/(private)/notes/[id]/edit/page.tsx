// react
import { Suspense } from "react";

// drizzle and db access
import { NoteDB } from "@/features/notes/db";

// services, features, and other libraries
import { Effect } from "effect";
import { ItemNotFoundError, runPageMainOrNavigate, validatePageInputs } from "@/lib/helpersEffect";
import { EditNotePageSchema } from "@/features/notes/schemas/editNotePage";
import { getUserSessionData } from "@/features/auth/lib/helpersEffect";

// components
import PageHeader from "@/components/PageHeader";
import BrowseBar from "@/features/notes/components/browse-bar";
import EditNoteForm from "@/features/notes/components/EditNoteForm";

// types
import type { Metadata } from "next";

// constants
export const metadata: Metadata = {
  title: "Total Recall AI ► Edit Note",
};

const main = ({ params, searchParams }: PageProps<"/notes/[id]/edit">) =>
  Effect.gen(function* () {
    // Safely validate next.js route inputs (`params` and `searchParams`) against a schema; return typed data or trigger a 404 on failure
    const {
      params: { id: noteId },
      searchParams: { str: searchTerm },
    } = yield* validatePageInputs(EditNotePageSchema, { params, searchParams });

    // Access the user session data from the server side or fail with an unauthorized access error
    const {
      user: { id: userId },
    } = yield* getUserSessionData;

    const noteDB = yield* NoteDB;

    // Get a single note for a user
    const note = yield* noteDB.getNote(noteId, userId);

    // If the note is not found, fail with item not found error
    if (!note) return yield* new ItemNotFoundError({ message: "Note not found" });

    return { searchTerm, note };
  });

// Page remains the fast, static shell
export default function Page({ params, searchParams }: PageProps<"/notes/[id]/edit">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

// This new async component contains the dynamic logic
async function PageContent({ params, searchParams }: PageProps<"/notes/[id]/edit">) {
  // Execute the main effect for the page, map known errors to the subsequent navigation helpers, and return the payload
  const { searchTerm, note } = await runPageMainOrNavigate(main({ params, searchParams }));

  return (
    <>
      <PageHeader title="Edit Note" description="Use the form below to edit an existing note" />
      <BrowseBar kind="note-edit" searchTerm={searchTerm} />
      <EditNoteForm note={note} />
    </>
  );
}

function PageSkeleton() {
  return (
    <>
      <PageHeader title="Edit Note" description="Use the form below to edit an existing note" />
    </>
  );
}

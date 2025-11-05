// react
import { Suspense } from "react";

// next
import { notFound } from "next/navigation";

// drizzle and db access
import { getNote } from "@/features/notes/db";

// services, features, and other libraries
import { validatePageInputs } from "@/lib/helpers";
import { EditNotePageSchema } from "@/features/notes/schemas/editNotePage";
import { getUserSessionData, makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";

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
  // Safely validate next.js route inputs (`params` and `searchParams`) against a zod schema; return typed data or trigger a 404 on failure
  const {
    params: { id: noteId },
  } = await validatePageInputs(EditNotePageSchema, { params, searchParams });

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
      <PageHeader title="Edit Note" description="Use the form below to edit an existing note" />
      <BrowseBar kind="note-edit" />
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

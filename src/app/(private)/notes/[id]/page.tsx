// react
import { Suspense } from "react";

// next
import { notFound } from "next/navigation";

// drizzle and db access
import { getAvailNoteTags, getNote } from "@/features/notes/db";

// services, features, and other libraries
import { validatePageInputs } from "@/lib/helpers";
import { NoteDetailsPageSchema } from "@/features/notes/schemas/noteDetailsPage";
import { getUserSessionData, makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";

// components
import { NotePreferencesStoreProvider } from "@/features/notes/stores/NotePreferencesProvider";
import PageHeader from "@/components/PageHeader";
import BrowseBar from "@/features/notes/components/browse-bar";
import NoteDetails from "@/features/notes/components/NoteDetails";

// types
import type { Metadata } from "next";

// constants
export const metadata: Metadata = {
  title: "Total Recall AI ► Note Details",
};

// Page remains the fast, static shell
export default function Page({ params, searchParams }: PageProps<"/notes/[id]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

// This new async component contains the dynamic logic
async function PageContent({ params, searchParams }: PageProps<"/notes/[id]">) {
  // Safely validate next.js route inputs (`params` and `searchParams`) against a zod schema; return typed data or trigger a 404 on failure
  const {
    params: { id: noteId },
    searchParams: { str: searchTerm },
  } = await validatePageInputs(NoteDetailsPageSchema, { params, searchParams });

  // Make sure the current user is authenticated (the check runs on the server side)
  await makeSureUserIsAuthenticated();

  // Access the user session data from the server side
  const {
    user: { id: userId },
  } = (await getUserSessionData())!;

  // Get a single note for a user as well as their available note tags
  const [note, availNoteTags] = await Promise.all([getNote(noteId, userId), getAvailNoteTags(userId)]);

  // If the note is not found, return a 404
  if (!note) notFound();

  return (
    <>
      <PageHeader title="Note Details" description="Below are all your note details" />
      <BrowseBar kind="note-details" searchTerm={searchTerm} />
      <NotePreferencesStoreProvider noteId={noteId} initState={note.preferences ?? undefined}>
        <NoteDetails note={note} availNoteTags={availNoteTags} />
      </NotePreferencesStoreProvider>
    </>
  );
}

function PageSkeleton() {
  return (
    <>
      <PageHeader title="Note Details" description="Below are all your note details" />
    </>
  );
}

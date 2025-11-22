// react
import { Suspense } from "react";

// next
import { connection } from "next/server";

// services, features, and other libraries
import { validatePageInputs } from "@/lib/helpers";
import { NoteDetailsPageSchema } from "@/features/notes/schemas/noteDetailsPage";

// components
import NoteModal from "@/features/notes/components/note-modal";
import BrowseBar from "@/features/notes/components/browse-bar";
import NoteDetails from "@/features/notes/components/NoteDetails";

// assets
import { DocumentIcon } from "@heroicons/react/24/outline";

// Page remains the fast, static shell
export default async function Page({ params, searchParams }: PageProps<"/notes/[id]">) {
  await connection();

  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

// This new async component contains the dynamic logic
async function PageContent({ params, searchParams }: PageProps<"/notes/[id]">) {
  // Safely validate next.js route inputs (`params` and `searchParams`) against a zod schema; return typed data or trigger a 404 on failure
  // const {
  //   params: { id: noteId },
  // } = await validatePageInputs(NoteDetailsPageSchema, { params, searchParams });

  const { id } = await params;
  const noteId = "8f149149-f54c-4255-9824-a7e68073ed46";

  return (
    <NoteModal icon={<DocumentIcon className="size-11 flex-none" />} browseBar={<BrowseBar kind="note-details" />} noteId={noteId}>
      <NoteDetails noteId={noteId} />
    </NoteModal>
  );
}

function PageSkeleton() {
  return null;
}

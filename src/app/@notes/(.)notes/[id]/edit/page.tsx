// react
import { Suspense } from "react";

// services, features, and other libraries
import { validatePageInputs } from "@/lib/helpers";
import { EditNotePageSchema } from "@/features/notes/schemas/editNotePage";

// components
import NoteModal from "@/features/notes/components/note-modal";
import BrowseBar from "@/features/notes/components/browse-bar";
import EditNoteForm from "@/features/notes/components/EditNoteForm";

// assets
import { DocumentTextIcon } from "@heroicons/react/24/outline";

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

  return (
    <NoteModal icon={<DocumentTextIcon className="size-11 flex-none" />} browseBar={<BrowseBar kind="note-edit" />} noteId={noteId}>
      <EditNoteForm />
    </NoteModal>
  );
}

function PageSkeleton() {
  return null;
}

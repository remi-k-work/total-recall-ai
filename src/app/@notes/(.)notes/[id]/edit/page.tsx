// react
import { Suspense } from "react";

// components
import NoteModal from "@/features/notes/components/note-modal";
import BrowseBar from "@/features/notes/components/browse-bar";
import EditNoteForm from "@/features/notes/components/EditNoteForm";

// assets
import { DocumentTextIcon } from "@heroicons/react/24/outline";

// Page remains the fast, static shell
export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContent />
    </Suspense>
  );
}

// This new async component contains the dynamic logic
async function PageContent() {
  return (
    <NoteModal icon={<DocumentTextIcon className="size-11 flex-none" />} browseBar={<BrowseBar kind="note-edit" />}>
      <EditNoteForm />
    </NoteModal>
  );
}

function PageSkeleton() {
  return null;
}

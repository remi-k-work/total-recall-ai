// react
import { Suspense } from "react";

// components
import NoteModal from "@/features/notes/components/note-modal";
import BrowseBar from "@/features/notes/components/browse-bar";
import NewNoteForm from "@/features/notes/components/NewNoteForm";

// assets
import { DocumentPlusIcon } from "@heroicons/react/24/outline";

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
    <NoteModal icon={<DocumentPlusIcon className="size-11 flex-none" />} browseBar={<BrowseBar kind="note-new" />}>
      <NewNoteForm inNoteModal />
    </NoteModal>
  );
}

function PageSkeleton() {
  return null;
}

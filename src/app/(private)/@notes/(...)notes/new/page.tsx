// components
import NoteModal from "@/features/notes/components/note-modal";
import BrowseBar from "@/features/notes/components/browse-bar";
import NewNoteForm from "@/features/notes/components/NewNoteForm2";

// assets
import { DocumentPlusIcon } from "@heroicons/react/24/outline";

export default function Page() {
  return (
    <NoteModal icon={<DocumentPlusIcon className="size-11 flex-none" />} browseBar={<BrowseBar kind="note-new" />}>
      <NewNoteForm inNoteModal />
    </NoteModal>
  );
}

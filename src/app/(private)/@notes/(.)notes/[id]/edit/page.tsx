// components
import NoteModal from "@/features/notes/components/note-modal";
import BrowseBar from "@/features/notes/components/browse-bar";
import EditNoteForm from "@/features/notes/components/EditNoteForm";

// assets
import { DocumentTextIcon } from "@heroicons/react/24/outline";

export default function Page() {
  return (
    <NoteModal icon={<DocumentTextIcon className="size-11 flex-none" />} browseBar={<BrowseBar kind="note-edit" />}>
      <EditNoteForm />
    </NoteModal>
  );
}

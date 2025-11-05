// components
import NoteModal from "@/features/notes/components/note-modal";
import BrowseBar from "@/features/notes/components/browse-bar";
import NoteDetails from "@/features/notes/components/NoteDetails";

// assets
import { DocumentIcon } from "@heroicons/react/24/outline";

export default function Page() {
  return (
    <NoteModal icon={<DocumentIcon className="size-11 flex-none" />} browseBar={<BrowseBar kind="note-details" />}>
      <NoteDetails />
    </NoteModal>
  );
}

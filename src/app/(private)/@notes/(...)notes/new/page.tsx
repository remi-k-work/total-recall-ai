// services, features, and other libraries
import { makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";

// components
import NoteModal from "@/features/notes/components/note-modal";
import BrowseBar from "@/features/notes/components/browse-bar";
import NewNoteForm from "@/features/notes/components/NewNoteForm";

// assets
import { DocumentPlusIcon } from "@heroicons/react/24/outline";

export default async function Page() {
  // Make sure the current user is authenticated (the check runs on the server side)
  try {
    await makeSureUserIsAuthenticated();
  } catch (error) {
    console.error(error);
  }
  return (
    <NoteModal icon={<DocumentPlusIcon className="size-11 flex-none" />} title="New Note" browseBar={<BrowseBar kind="note-new" />}>
      <NewNoteForm inNoteModal />
    </NoteModal>
  );
}

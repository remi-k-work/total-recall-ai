"use client";

// next
import { useParams } from "next/navigation";

// components
import NoteModal from "@/features/notes/components/note-modal";
import BrowseBar from "@/features/notes/components/browse-bar";
import NoteDetails from "@/features/notes/components/NoteDetails";

// assets
import { DocumentIcon } from "@heroicons/react/24/outline";

// Page remains the fast, static shell
export default function Page() {
  const { id: noteId } = useParams<{ id: string }>();

  return (
    <NoteModal icon={<DocumentIcon className="size-11 flex-none" />} browseBar={<BrowseBar kind="note-details" />} noteId={noteId}>
      <NoteDetails noteId={noteId} />
    </NoteModal>
  );
}

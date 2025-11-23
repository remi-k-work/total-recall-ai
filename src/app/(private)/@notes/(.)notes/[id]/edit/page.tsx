"use client";

// next
import { useParams } from "next/navigation";

// services, features, and other libraries
import { useQuery } from "@tanstack/react-query";

// components
import NoteModal from "@/features/notes/components/note-modal";
import BrowseBar from "@/features/notes/components/browse-bar";
import EditNoteForm from "@/features/notes/components/EditNoteForm";

// assets
import { DocumentTextIcon } from "@heroicons/react/24/outline";

// types
import type { getNote } from "@/features/notes/db";

export default function Page() {
  const { id: noteId } = useParams<{ id: string }>();

  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["note", noteId],
    queryFn: async ({ signal }): Promise<Awaited<ReturnType<typeof getNote>>> => {
      const res = await fetch(`/api/notes/${noteId}`, { cache: "no-store", credentials: "same-origin", mode: "same-origin", signal });
      if (!res.ok) throw new Error(res.statusText);
      return await res.json();
    },
    enabled: !!noteId,
  });

  if (isError) console.error(error);
  if (isLoading || isError || !note) return null;

  return (
    <NoteModal icon={<DocumentTextIcon className="size-11 flex-none" />} browseBar={<BrowseBar kind="note-edit" />} noteTitle={note.title}>
      <EditNoteForm note={note} inNoteModal />
    </NoteModal>
  );
}

// next
import Link from "next/link";

// components
import InfoLine from "@/components/form/InfoLine";
import NotePreview from "@/features/notes/components/NotePreview";

// types
import type { getNotesWithPagination } from "@/features/notes/db";

interface NotesPreviewProps {
  notes: Awaited<ReturnType<typeof getNotesWithPagination>>["notes"];
}

export default function NotesPreview({ notes }: NotesPreviewProps) {
  if (notes.length === 0) return <InfoLine message="No notes have been found!" className="justify-center px-6 py-9 text-xl" />;

  return (
    <article className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {notes.map((note) => (
        <Link key={note.id} href={`/notes/${note.id}`}>
          <NotePreview note={note} />
        </Link>
      ))}
    </article>
  );
}

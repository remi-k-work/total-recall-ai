// next
import Link from "next/link";

// components
import NotePreview from "@/features/notes/components/NotePreview";

// types
import type { getNotes } from "@/features/notes/db";

interface NotesPreviewProps {
  notes: Awaited<ReturnType<typeof getNotes>>;
}

export default function NotesPreview({ notes }: NotesPreviewProps) {
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

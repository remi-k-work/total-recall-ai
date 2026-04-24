// services, features, and other libraries
import { cn } from "@/lib/utils";

// components
import InfoLine from "@/components/formOld/InfoLine";
import NotePreview from "@/features/notes/components/NotePreview";

// types
import type { AvailNoteTags, NotesWithPagination } from "@/features/notes/db";

interface NotesPreviewProps {
  notes: NotesWithPagination;
  availNoteTags: AvailNoteTags;
}

export default function NotesPreview({ notes, availNoteTags }: NotesPreviewProps) {
  if (notes.length === 0) return <InfoLine message="No notes have been found!" className="justify-center px-6 py-9 text-xl" />;

  return (
    <article className={cn("select-none", notes.length === 1 ? "columns-1" : "columns-md gap-4")}>
      {notes.map((note) => {
        const { id: noteId } = note;

        return <NotePreview key={noteId} note={note} availNoteTags={availNoteTags} />;
      })}
    </article>
  );
}

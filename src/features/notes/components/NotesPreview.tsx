// services, features, and other libraries
import { cn } from "@/lib/utils";

// components
import { NotePreferencesStoreProvider } from "@/features/notes/stores/NotePreferencesProvider";
import InfoLine from "@/components/form/InfoLine";
import NotePreview from "@/features/notes/components/NotePreview";

// types
import type { getAllNoteTags, getNotesWithPagination } from "@/features/notes/db";

interface NotesPreviewProps {
  notes: Awaited<ReturnType<typeof getNotesWithPagination>>["notes"];
  noteTags: Awaited<ReturnType<typeof getAllNoteTags>>;
}

export default function NotesPreview({ notes, noteTags }: NotesPreviewProps) {
  if (notes.length === 0) return <InfoLine message="No notes have been found!" className="justify-center px-6 py-9 text-xl" />;

  return (
    <article className={cn("select-none", notes.length === 1 ? "columns-1" : "columns-md gap-4")}>
      {notes.map((note) => {
        const { id: noteId, preferences } = note;

        return (
          <NotePreferencesStoreProvider key={noteId} noteId={noteId} initState={preferences ?? undefined}>
            <NotePreview note={note} noteTags={noteTags} />
          </NotePreferencesStoreProvider>
        );
      })}
    </article>
  );
}

// next
import Link from "next/link";

// components
import { NotePreferencesStoreProvider } from "@/features/notes/stores/NotePreferencesProvider";
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
    <article className={notes.length === 1 ? "columns-1" : "columns-md gap-4"}>
      {notes.map((note) => {
        const { id: noteId, preferences } = note;

        return (
          // <Link key={noteId} href={`/notes/${noteId}`} className="block break-inside-avoid pb-4">
          <div key={noteId} className="block break-inside-avoid pb-4">
            <NotePreferencesStoreProvider noteId={noteId} initState={preferences ?? undefined}>
              <NotePreview note={note} />
            </NotePreferencesStoreProvider>
          </div>
          // </Link>
        );
      })}
    </article>
  );
}

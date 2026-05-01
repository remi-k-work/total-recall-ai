// react
import { useMemo } from "react";

// services, features, and other libraries
import { useAtomInitialValues, useAtomSet, useAtomValue } from "@effect-atom/atom-react";
import { noteTagsAtom, optiNoteTagsAtom, syncToDbNoteTagsAtom } from ".";

// types
import type { AvailNoteTags, NoteDetails, NoteWithPagination } from "@/features/notes/db";

// Manages note tags, including hydration, zero-read setter actions, and debounced database synchronization
export function useNoteTags(note: NoteWithPagination | NoteDetails, availNoteTags: AvailNoteTags) {
  // Hydrate the master atom on mount
  const { id: noteId } = note;
  const tagIds = useMemo(() => ("contentPreview" in note ? note.tags.map(({ id }) => id) : note.noteToNoteTag.map(({ noteTagId }) => noteTagId)), [note]);
  useAtomInitialValues([[noteTagsAtom(noteId), tagIds]]);

  // Subscriptions and actions
  const optiNoteTags = useAtomValue(optiNoteTagsAtom(noteId));
  const syncToDbNoteTags = useAtomSet(syncToDbNoteTagsAtom(noteId));

  // Compute selected tag objects for rendering badges
  const selectedTags = useAtomValue(optiNoteTagsAtom(noteId), (tagIds) => {
    const selectedSet = new Set(tagIds);
    return availNoteTags.filter(({ id }) => selectedSet.has(id));
  });

  return { optiNoteTags, selectedTags, syncToDbNoteTags } as const;
}

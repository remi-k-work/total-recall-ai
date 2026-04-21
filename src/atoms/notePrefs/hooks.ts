// react
import { startTransition, useCallback, useMemo } from "react";

// services, features, and other libraries
import { useAtomInitialValues, useAtomSet } from "@effect-atom/atom-react";
import { notePrefsAtom, syncToDbNotePrefsAtom, togglePinAtom } from ".";

// types
import type { NoteDetails, NoteWithPagination } from "@/features/notes/db";

// constants
import { INIT_NOTE_PREFS } from ".";

// Manages note preferences, including hydration, zero-read setter actions, and debounced database synchronization
export function useNotePrefs(note: NoteWithPagination | NoteDetails) {
  // Hydrate the master atom on mount
  const { id: noteId, preferences } = note;
  const incomingNotePrefs = useMemo(() => ({ ...INIT_NOTE_PREFS, ...preferences }), [preferences]);
  useAtomInitialValues([[notePrefsAtom(noteId), incomingNotePrefs]]);

  // Subscriptions and actions
  const syncToDbNotePrefs = useAtomSet(syncToDbNotePrefsAtom(noteId));
  const togglePin = useAtomSet(togglePinAtom(noteId));

  const changedColor = useCallback((color: string) => startTransition(() => syncToDbNotePrefs({ color })), [syncToDbNotePrefs]);
  const changedPosition = useCallback((posX: number, posY: number) => startTransition(() => syncToDbNotePrefs({ posX, posY })), [syncToDbNotePrefs]);
  const toggledPin = useCallback(() => startTransition(() => togglePin()), [togglePin]);

  return { changedColor, changedPosition, toggledPin } as const;
}

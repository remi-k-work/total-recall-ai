// react
import { startTransition, useCallback, useMemo } from "react";

// services, features, and other libraries
import { useAtomInitialValues, useAtomSet, useAtomValue } from "@effect-atom/atom-react";
import { notePrefsAtom, selIsPinnedAtom, syncToDbNotePrefsAtom } from ".";

// types
import type { NotePrefs } from ".";

// constants
import { INIT_NOTE_PREFS } from ".";

// Hydrates the master atom with server-rendered preferences on mount
export function useNotePrefsManager(noteId: string, preferences: NotePrefs | null) {
  const incomingNotePrefs = useMemo(() => ({ ...INIT_NOTE_PREFS, ...preferences }), [preferences]);
  useAtomInitialValues([[notePrefsAtom(noteId), incomingNotePrefs]]);
}

// Exposes zero-read setter actions that never cause component re-renders
export function useNotePrefsActions(noteId: string) {
  const syncToDbNotePrefs = useAtomSet(syncToDbNotePrefsAtom(noteId));
  const isPinned = useAtomValue(selIsPinnedAtom(noteId));

  const changedColor = useCallback((color: string) => startTransition(() => syncToDbNotePrefs({ color })), [syncToDbNotePrefs]);
  const changedPosition = useCallback((posX: number, posY: number) => startTransition(() => syncToDbNotePrefs({ posX, posY })), [syncToDbNotePrefs]);
  const toggledPin = useCallback(() => startTransition(() => syncToDbNotePrefs({ isPinned: !isPinned })), [syncToDbNotePrefs, isPinned]);

  return { changedColor, changedPosition, toggledPin } as const;
}

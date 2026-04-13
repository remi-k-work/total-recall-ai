// react
import { useCallback } from "react";

// services, features, and other libraries
import { useAtomSet } from "@effect-atom/atom-react";
import { notePrefsAtom } from ".";

// Exposes zero-read setter actions that can be used anywhere without causing re-renders
export function useNotePrefsActions(noteId: string) {
  const setNotePrefs = useAtomSet(notePrefsAtom(noteId));

  // State mutators utilizing the standard callback pattern to avoid dependency arrays
  const changedColor = useCallback((color: string) => setNotePrefs((prev) => ({ ...prev, color })), [setNotePrefs]);
  const changedPosition = useCallback((posX: number, posY: number) => setNotePrefs((prev) => ({ ...prev, posX, posY })), [setNotePrefs]);
  const toggledPin = useCallback(() => setNotePrefs((prev) => ({ ...prev, isPinned: !prev.isPinned })), [setNotePrefs]);

  return { changedColor, changedPosition, toggledPin } as const;
}

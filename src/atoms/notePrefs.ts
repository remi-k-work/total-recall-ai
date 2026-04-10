// react
import { useCallback, useEffect } from "react";

// services, features, and other libraries
import { Effect } from "effect";
import { Atom, useAtom, useAtomSet } from "@effect-atom/atom-react";
import { RuntimeAtom } from "@/lib/RuntimeClient";

// types
export interface NotePrefs {
  color?: string;
  position?: { x: number; y: number };
  isPinned: boolean;
}

// constants
const INIT_NOTE_PREFS = { color: undefined, position: undefined, isPinned: false } as const satisfies NotePrefs;

//
const notePrefsAtom = Atom.family(() => Atom.make<NotePrefs>(INIT_NOTE_PREFS));
const syncToDbActionAtom = RuntimeAtom.fn(
  Effect.fnUntraced(function* ({ noteId, preferences }: { noteId: string; preferences: NotePrefs }) {
    yield* Effect.log(`Mutating the note prefs for note ${noteId} to ${JSON.stringify(preferences, null, 2)}`);
  }),
);

// This hook exposes the state of the note preferences store and the actions that are allowed
export function useNotePrefs(noteId: string, preferences: NotePrefs | null) {
  const [notePrefs, setNotePrefs] = useAtom(notePrefsAtom(noteId));
  const syncToDbAction = useAtomSet(syncToDbActionAtom);

  useEffect(() => {
    setNotePrefs(preferences ?? INIT_NOTE_PREFS);
  }, [preferences, setNotePrefs]);

  // Actions
  const changedColor = useCallback(
    (color: string) => {
      setNotePrefs({ ...notePrefs, color });
      syncToDbAction({ noteId, preferences: { ...notePrefs, color } });
    },
    [noteId, notePrefs, setNotePrefs, syncToDbAction],
  );
  const changedPosition = useCallback((x: number, y: number) => setNotePrefs({ ...notePrefs, position: { x, y } }), [notePrefs, setNotePrefs]);
  const toggledPin = useCallback(() => setNotePrefs({ ...notePrefs, isPinned: !notePrefs.isPinned }), [notePrefs, setNotePrefs]);

  return { ...notePrefs, changedColor, changedPosition, toggledPin };
}

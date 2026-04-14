// react
import { useEffect, useMemo, useRef } from "react";

// services, features, and other libraries
import { Data, Equal } from "effect";
import { useAtomSet, useAtomSubscribe } from "@effect-atom/atom-react";
import { notePrefsAtom, syncToDbAtom } from ".";

// types
import type { NotePrefs } from ".";

// constants
import { INIT_NOTE_PREFS } from ".";

// The hook should be mounted once for each note (for example, in the root wrapper) to manage hydration and database synchronization
export function useNotePrefsManager(noteId: string, preferences: NotePrefs | null) {
  const setNotePrefs = useAtomSet(notePrefsAtom(noteId));
  const syncToDb = useAtomSet(syncToDbAtom(noteId));

  // Normalize incoming preferences against the initial default state
  const incomingNotePrefs = useMemo(() => ({ ...INIT_NOTE_PREFS, ...preferences }), [preferences]);

  // Keep a ref of what we last synced to prevent bouncing/duplicate API calls
  const lastSyncedRef = useRef<NotePrefs>(incomingNotePrefs);

  // Hydrate the master atom on mount, skipping if the incoming preferences are empty
  useEffect(() => {
    if (Equal.equals(Data.struct(incomingNotePrefs), Data.struct(INIT_NOTE_PREFS))) return;
    setNotePrefs(incomingNotePrefs);
  }, [incomingNotePrefs, setNotePrefs]);

  // Sync the note prefs to the database only when the debounced atom actually emits a change
  useAtomSubscribe(
    notePrefsAtom(noteId),
    (newNotePrefs) => {
      if (Equal.equals(Data.struct(newNotePrefs), Data.struct(incomingNotePrefs))) return;
      if (Equal.equals(Data.struct(newNotePrefs), Data.struct(lastSyncedRef.current))) return;

      // Sync and update cache
      syncToDb(newNotePrefs);
      lastSyncedRef.current = newNotePrefs;
    },
    { immediate: false },
  );
}

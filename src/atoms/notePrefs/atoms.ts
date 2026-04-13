// services, features, and other libraries
import { Effect } from "effect";
import { Atom } from "@effect-atom/atom-react";
import { RuntimeAtom } from "@/lib/RuntimeClient";

// types
export interface NotePrefs {
  color: string | null;
  posX: number | null;
  posY: number | null;
  isPinned: boolean;
}

// constants
export const INIT_NOTE_PREFS = { color: null, posX: null, posY: null, isPinned: false } as const satisfies NotePrefs;

// Master atom storing note preferences, debounced to consolidate rapid changes into a single update
export const notePrefsAtom = Atom.family(() => Atom.make<NotePrefs>(INIT_NOTE_PREFS).pipe(Atom.debounce("3 seconds")));

// Async atom responsible for syncing the updated note preferences to the database
export const syncToDbAtom = Atom.family((noteId: string) =>
  RuntimeAtom.fn(
    Effect.fnUntraced(function* (newNotePrefs: NotePrefs) {
      yield* Effect.log(`[DB SYNC] Saving note ${noteId}: ${JSON.stringify(newNotePrefs)}`);
    }),
  ),
);

// Selectors are atoms derived from the master atom; components subscribing to these will re-render only when specific properties change
export const selColorAtom = Atom.family((noteId: string) => notePrefsAtom(noteId).pipe(Atom.map((state) => state.color)));
export const selPosXAtom = Atom.family((noteId: string) => notePrefsAtom(noteId).pipe(Atom.map((state) => state.posX)));
export const selPosYAtom = Atom.family((noteId: string) => notePrefsAtom(noteId).pipe(Atom.map((state) => state.posY)));
export const selIsPinnedAtom = Atom.family((noteId: string) => notePrefsAtom(noteId).pipe(Atom.map((state) => state.isPinned)));

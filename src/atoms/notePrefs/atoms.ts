// services, features, and other libraries
import { Effect, Option } from "effect";
import { Atom } from "@effect-atom/atom-react";
import { RuntimeAtom } from "@/lib/RuntimeClient";
import { RpcNotesClient } from "@/features/notes/rpc/client";

// types
export interface NotePrefs {
  color: string | null;
  posX: number | null;
  posY: number | null;
  isPinned: boolean;
}

// constants
export const INIT_NOTE_PREFS = { color: null, posX: null, posY: null, isPinned: false } as const satisfies NotePrefs;

// Master atom storing note preferences, using a writable family that persists its value on refresh
export const notePrefsAtom = Atom.family(() =>
  Atom.writable<NotePrefs, NotePrefs>(
    (get) => Option.getOrElse(get.self(), () => INIT_NOTE_PREFS),
    (ctx, value) => ctx.setSelf(value)
  )
);

// Optimistic view of the master atom for immediate UI feedback and automatic rollback
export const optiNotePrefsAtom = Atom.family((noteId: string) => Atom.optimistic(notePrefsAtom(noteId)));

// Mutation atom that updates the local state immediately and syncs to the DB after a 3s debounce
export const syncToDbNotePrefsAtom = Atom.family((noteId: string) =>
  Atom.optimisticFn(optiNotePrefsAtom(noteId), {
    reducer: (current, patch: Partial<NotePrefs>) => ({ ...current, ...patch }),
    fn: RuntimeAtom.fn((_, get) =>
      Effect.gen(function* () {
        yield* Effect.sleep("3 seconds");

        const value = get(optiNotePrefsAtom(noteId));

        const { syncToDbNotePrefs } = yield* RpcNotesClient;
        yield* syncToDbNotePrefs({ noteId, ...value });

        yield* Effect.log(`[DB SYNC] Saving note prefs for ${noteId}: ${JSON.stringify(value)}`);

        get.set(notePrefsAtom(noteId), value);
      })
    ),
  })
);

// Granular selectors derived from the optimistic atom to minimize unnecessary re-renders
export const selColorAtom = Atom.family((noteId: string) => optiNotePrefsAtom(noteId).pipe(Atom.map((state) => state.color)));
export const selPosXAtom = Atom.family((noteId: string) => optiNotePrefsAtom(noteId).pipe(Atom.map((state) => state.posX)));
export const selPosYAtom = Atom.family((noteId: string) => optiNotePrefsAtom(noteId).pipe(Atom.map((state) => state.posY)));
export const selIsPinnedAtom = Atom.family((noteId: string) => optiNotePrefsAtom(noteId).pipe(Atom.map((state) => state.isPinned)));

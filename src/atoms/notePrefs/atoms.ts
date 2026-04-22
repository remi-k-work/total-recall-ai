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
  ).pipe(Atom.keepAlive)
);

// Optimistic view of the master atom for immediate UI feedback and automatic rollback
export const optiNotePrefsAtom = Atom.family((noteId: string) => Atom.optimistic(notePrefsAtom(noteId)));

// Async atom for debounced server sync, utilizing optimisticFn for UI/DB coordination
export const syncToDbNotePrefsAtom = Atom.family((noteId: string) =>
  Atom.optimisticFn(optiNotePrefsAtom(noteId), {
    reducer: (current, update: Partial<NotePrefs>) => ({ ...current, ...update }),
    fn: RuntimeAtom.fn((_, get) =>
      Effect.gen(function* () {
        yield* Effect.sleep("3 seconds");

        // Retrieve the finalized state from the optimistic atom for commitment
        const result = get(optiNotePrefsAtom(noteId));

        const { syncToDbNotePrefs } = yield* RpcNotesClient;
        yield* syncToDbNotePrefs({ noteId, ...result });
        get.set(notePrefsAtom(noteId), result);

        yield* Effect.log(`[DB SYNC] Saving note prefs for ${noteId}: ${JSON.stringify(result)}`);
      })
    ),
  })
);

// Granular selectors derived from the optimistic atom to minimize unnecessary re-renders
export const notePrefsColorAtom = Atom.family((noteId: string) => optiNotePrefsAtom(noteId).pipe(Atom.map((state) => state.color)));
export const notePrefsPosXAtom = Atom.family((noteId: string) => optiNotePrefsAtom(noteId).pipe(Atom.map((state) => state.posX)));
export const notePrefsPosYAtom = Atom.family((noteId: string) => optiNotePrefsAtom(noteId).pipe(Atom.map((state) => state.posY)));
export const notePrefsIsPinnedAtom = Atom.family((noteId: string) => optiNotePrefsAtom(noteId).pipe(Atom.map((state) => state.isPinned)));

// Atom function for toggling the pin state without requiring a component-side read
export const togglePinAtom = Atom.family((noteId: string) =>
  Atom.fnSync((_, get) => {
    const isPinned = get(notePrefsIsPinnedAtom(noteId));
    get.set(syncToDbNotePrefsAtom(noteId), { isPinned: !isPinned });
  })
);

// services, features, and other libraries
import { Effect, Option } from "effect";
import { Atom } from "@effect-atom/atom-react";
import { RuntimeAtom } from "@/lib/RuntimeClient";
import { RpcNotesClient } from "@/features/notes/rpc/client";

// types
export interface NotePrefs {
  color: string | null;
  border: string | null;
  posX: number | null;
  posY: number | null;
  isPinned: boolean;
}

// constants
export const NOTE_PREFS_BORDERS = [
  "255px 15px 225px 15px / 15px 225px 15px 255px",
  "125px 10px 20px 185px / 25px 205px 205px 25px",
  "15px 255px 15px 225px / 225px 15px 255px 15px",
  "15px 25px 155px 25px / 225px 150px 25px 115px",
  "250px 25px 15px 20px / 15px 80px 105px 115px",
  "28px 100px 20px 15px / 150px 30px 205px 225px",
  "30% 70% 70% 30% / 53% 30% 70% 47%",
  "53% 47% 34% 66% / 63% 46% 54% 37%",
  "37% 63% 56% 44% / 49% 56% 44% 51%",
  "63% 37% 37% 63% / 43% 37% 63% 57%",
  "49% 51% 48% 52% / 57% 44% 56% 43%",
] as const;

export const INIT_NOTE_PREFS = { color: null, border: null, posX: null, posY: null, isPinned: false } as const satisfies NotePrefs;

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
export const notePrefsBorderAtom = Atom.family((noteId: string) => optiNotePrefsAtom(noteId).pipe(Atom.map((state) => state.border)));
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

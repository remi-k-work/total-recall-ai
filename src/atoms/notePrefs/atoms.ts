// services, features, and other libraries
import { Effect, Option } from "effect";
import { Atom } from "@effect-atom/atom-react";
import { RuntimeAtom } from "@/lib/RuntimeClient";
import { RpcNotesClient } from "@/features/notes/rpc/client";

// types
export interface NotePrefs {
  color: string | null;
  border: string | null;
  mask: string | null;
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

export const NOTE_PREFS_MASKS = [
  "radial-gradient(20px at 50% 100%,#0000 97%,#000) 50% / calc(1.9 * 20px) 100%",
  "radial-gradient(20px at 50% 0,#0000 97%,#000) 50% / calc(1.9 * 20px) 100%",
  "radial-gradient(20px at 50% 20px,#0000 97%,#000) 50% -20px/ calc(1.9 * 20px) 100%",
  "radial-gradient(20px at 0 50%,#0000 97%,#000) 50%/ 100% calc(1.9 * 20px)",
  "radial-gradient(20px at 100% 50%,#0000 97%,#000) 50%/ 100% calc(1.9 * 20px)",
  "radial-gradient(20px at 20px 50%,#0000 97%,#000) -20px/ 100% calc(1.9 * 20px)",
  "radial-gradient(farthest-side,#000 97%,#0000) 0 0 / 20px 20px round,linear-gradient(#000 0 0) 50%/calc(100% - 20px) calc(100% - 20px) no-repeat",
  "linear-gradient(to top,#0000 20px,#000 0),radial-gradient(20px at top,#000 97%,#0000) bottom / calc(1.9 * 20px) 20px",
  "linear-gradient(to bottom,#0000 20px,#000 0),radial-gradient(20px at bottom,#000 97%,#0000) top / calc(1.9 * 20px) 20px",
  "linear-gradient(0deg,#0000 calc(2 * 20px),#000 0) 0 20px,radial-gradient(20px,#000 97%,#0000) 50% / calc(1.9 * 20px) calc(2 * 20px) repeat space",
  "linear-gradient(to right,#0000 20px,#000 0),radial-gradient(20px at right,#000 97%,#0000) left / 20px calc(1.9 * 20px)",
  "linear-gradient(to left,#0000 20px,#000 0),radial-gradient(20px at left,#000 97%,#0000) right / 20px calc(1.9 * 20px)",
  "linear-gradient(-90deg,#0000 calc(2 * 20px),#000 0) 20px,radial-gradient(20px,#000 97%,#0000) 50% / calc(2 * 20px) calc(1.9 * 20px) space repeat",
  "radial-gradient(20px at bottom,#0000 97%,#000) 50% calc(100% - 20px) / calc(2 * 20px) 100% repeat-x,radial-gradient(20px at 25% 50%,#000 97%,#0000) calc(50% - 20px) 99% / calc(4 * 20px) calc(2 * 20px) repeat-x",
  "radial-gradient(20px at top,#0000 97%,#000) 50% 20px / calc(2 * 20px) 100% repeat-x,radial-gradient(20px at 25% 50%,#000 97%,#0000) calc(50% - 20px) 1% / calc(4 * 20px) calc(2 * 20px) repeat-x",
  "radial-gradient(20px at top,#0000 97%,#000) 50% 20px / calc(2 * 20px) 51% repeat-x,radial-gradient(20px at bottom,#0000 97%,#000) 50% calc(100% - 20px) / calc(2 * 20px) 51% repeat-x,radial-gradient(20px at 25% 50%,#000 97%,#0000) calc(50% - 20px) 1% / calc(4 * 20px) calc(2 * 20px) repeat-x,radial-gradient(20px at 25% 50%,#000 97%,#0000) calc(50% - 3*20px) 99% / calc(4 * 20px) calc(2 * 20px) repeat-x",
  "radial-gradient(20px at left,#0000 97%,#000) 20px 50% / 100% calc(2 * 20px) repeat-y,radial-gradient(20px at 50% 25%,#000 97%,#0000) 1% calc(50% - 20px) / calc(2 * 20px) calc(4 * 20px) repeat-y",
  "radial-gradient(20px at right,#0000 97%,#000) calc(100% - 20px) 50% / 100% calc(2 * 20px) repeat-y,radial-gradient(20px at 50% 25%,#000 97%,#0000) 99% calc(50% - 20px) / calc(2 * 20px) calc(4 * 20px) repeat-y",
  "radial-gradient(20px at left,#0000 97%,#000) 20px 50% / 51% calc(2 * 20px) repeat-y,radial-gradient(20px at right,#0000 97%,#000) calc(100% - 20px) 50% / 51% calc(2 * 20px) repeat-y,radial-gradient(20px at 50% 25%,#000 97%,#0000) 1% calc(50% - 20px) / calc(2 * 20px) calc(4 * 20px) repeat-y,radial-gradient(20px at 50% 25%,#000 97%,#0000) 99% calc(50% - 3*20px) / calc(2 * 20px) calc(4 * 20px) repeat-y",
  // ** zig zag top **
] as const;

export const INIT_NOTE_PREFS = { color: null, border: null, mask: null, posX: null, posY: null, isPinned: false } as const satisfies NotePrefs;

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
export const notePrefsMaskAtom = Atom.family((noteId: string) => optiNotePrefsAtom(noteId).pipe(Atom.map((state) => state.mask)));
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

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
  "*",
  "18px 22px 20px 24px / 24px 20px 22px 18px",
  "16px 28px 18px 26px / 26px 18px 28px 16px",
  "20px 18px 26px 22px / 22px 26px 18px 20px",
  "58% 42% 35% 65% / 45% 55% 65% 35%",
  "65% 35% 55% 45% / 35% 65% 45% 55%",
  "48% 52% 60% 40% / 60% 40% 52% 48%",
  "30% 70% 60% 40% / 40% 30% 70% 60%",
  "75% 25% 35% 65% / 65% 45% 55% 35%",
  "40% 60% 30% 70% / 70% 30% 60% 40%",
  "80% 20% 70% 30% / 30% 70% 20% 80%",
  "25% 75% 65% 35% / 75% 25% 35% 65%",
  "70% 30% 80% 20% / 20% 80% 30% 70%",
  "8px 220px 12px 200px / 200px 12px 220px 8px",
  "12px 180px 30px 220px / 220px 30px 180px 12px",
  "200px 10px 160px 25px / 25px 160px 10px 200px",
  "14px 90px 18px 130px / 130px 18px 90px 14px",
  "110px 24px 140px 28px / 28px 140px 24px 110px",
  "22px 140px 26px 80px / 80px 26px 140px 22px",
  "50% 50% 45% 55% / 55% 45% 50% 50%",
  "50% 50% 60% 40% / 40% 60% 50% 50%",
  "52% 48% 58% 42% / 42% 58% 48% 52%",
  "90% 10% 70% 30% / 30% 70% 10% 90%",
  "15% 85% 20% 80% / 80% 20% 85% 15%",
  "85% 15% 40% 60% / 60% 40% 15% 85%",
  "33% 67% 45% 55% / 60% 30% 70% 40%",
  "62% 38% 28% 72% / 48% 66% 34% 52%",
  "41% 59% 63% 37% / 37% 63% 59% 41%",
  "40px 60% 30px 70% / 70% 30px 60% 40px",
  "60% 30px 70% 40px / 40px 70% 30px 60%",
  "25px 80% 45px 60% / 60% 45px 80% 25px",
] as const;

export const NOTE_PREFS_MASKS = [
  "*",
  "radial-gradient(20px at 50% 100%,#0000 97%,#000) 50%/calc(1.9*20px) 100%",
  "radial-gradient(20px at 50% 0,#0000 97%,#000) 50%/calc(1.9*20px) 100%",
  "radial-gradient(20px at 50% 20px,#0000 97%,#000) 50% -20px/calc(1.9*20px) 100%",
  "radial-gradient(20px at 0 50%,#0000 97%,#000) 50%/100% calc(1.9*20px)",
  "radial-gradient(20px at 100% 50%,#0000 97%,#000) 50%/100% calc(1.9*20px)",
  "radial-gradient(20px at 20px 50%,#0000 97%,#000) -20px/100% calc(1.9*20px)",
  "radial-gradient(farthest-side,#000 97%,#0000) 0 0/20px 20px round,linear-gradient(#000 0 0) 50%/calc(100% - 20px) calc(100% - 20px) no-repeat",
  "linear-gradient(to top,#0000 20px,#000 0),radial-gradient(20px at top,#000 97%,#0000) bottom/calc(1.9*20px) 20px",
  "linear-gradient(to bottom,#0000 20px,#000 0),radial-gradient(20px at bottom,#000 97%,#0000) top/calc(1.9*20px) 20px",
  "linear-gradient(0deg,#0000 calc(2*20px),#000 0) 0 20px,radial-gradient(20px,#000 97%,#0000) 50%/calc(1.9*20px) calc(2*20px) repeat space",
  "linear-gradient(to right,#0000 20px,#000 0),radial-gradient(20px at right,#000 97%,#0000) left/20px calc(1.9*20px)",
  "linear-gradient(to left,#0000 20px,#000 0),radial-gradient(20px at left,#000 97%,#0000) right/20px calc(1.9*20px)",
  "linear-gradient(-90deg,#0000 calc(2*20px),#000 0) 20px,radial-gradient(20px,#000 97%,#0000) 50%/calc(2*20px) calc(1.9*20px) space repeat",
  "radial-gradient(20px at bottom,#0000 97%,#000) 50% calc(100% - 20px)/calc(2*20px) 100% repeat-x,radial-gradient(20px at 25% 50%,#000 97%,#0000) calc(50% - 20px) 99%/calc(4*20px) calc(2*20px) repeat-x",
  "radial-gradient(20px at top,#0000 97%,#000) 50% 20px/calc(2*20px) 100% repeat-x,radial-gradient(20px at 25% 50%,#000 97%,#0000) calc(50% - 20px) 1%/calc(4*20px) calc(2*20px) repeat-x",
  "radial-gradient(20px at top,#0000 97%,#000) 50% 20px/calc(2*20px) 51% repeat-x,radial-gradient(20px at bottom,#0000 97%,#000) 50% calc(100% - 20px)/calc(2*20px) 51% repeat-x,radial-gradient(20px at 25% 50%,#000 97%,#0000) calc(50% - 20px) 1%/calc(4*20px) calc(2*20px) repeat-x,radial-gradient(20px at 25% 50%,#000 97%,#0000) calc(50% - 3*20px) 99%/calc(4*20px) calc(2*20px) repeat-x",
  "radial-gradient(20px at left,#0000 97%,#000) 20px 50%/100% calc(2*20px) repeat-y,radial-gradient(20px at 50% 25%,#000 97%,#0000) 1% calc(50% - 20px)/calc(2*20px) calc(4*20px) repeat-y",
  "radial-gradient(20px at right,#0000 97%,#000) calc(100% - 20px) 50%/100% calc(2*20px) repeat-y,radial-gradient(20px at 50% 25%,#000 97%,#0000) 99% calc(50% - 20px)/calc(2*20px) calc(4*20px) repeat-y",
  "radial-gradient(20px at left,#0000 97%,#000) 20px 50%/51% calc(2*20px) repeat-y,radial-gradient(20px at right,#0000 97%,#000) calc(100% - 20px) 50%/51% calc(2*20px) repeat-y,radial-gradient(20px at 50% 25%,#000 97%,#0000) 1% calc(50% - 20px)/calc(2*20px) calc(4*20px) repeat-y,radial-gradient(20px at 50% 25%,#000 97%,#0000) 99% calc(50% - 3*20px)/calc(2*20px) calc(4*20px) repeat-y",
  "conic-gradient(from 135deg at top,#0000,#000 1deg 90deg,#0000 91deg) 50%/40px 100%",
  "conic-gradient(from -45deg at bottom,#0000,#000 1deg 90deg,#0000 91deg) 50%/40px 100%",
  "conic-gradient(from 45deg at left,#0000,#000 1deg 90deg,#0000 91deg) 50%/100% 40px",
  "conic-gradient(from -135deg at right,#0000,#000 1deg 90deg,#0000 91deg) 50%/100% 40px",
  "repeating-conic-gradient(from 45deg at 20px 50%,#0000,#000 1deg 90deg,#0000 91deg 180deg) -20px 50%/100% 40px",
  "repeating-conic-gradient(from 135deg at 50% 20px,#0000,#000 1deg 90deg,#0000 91deg 180deg) 50% -20px/40px 100%",
  "radial-gradient(1rem at 1rem 1rem,#0000 99%,#000) -1rem -1rem",
  "radial-gradient(2rem at 2rem 2rem,#0000 99%,#000) -2rem -2rem",
  "radial-gradient(4rem at 4rem 4rem,#0000 99%,#000) -4rem -4rem",
  "conic-gradient(at calc(2*1rem) calc(2*1rem),#000 75%,#0000 0) -1rem -1rem",
  "conic-gradient(at calc(2*2rem) calc(2*2rem),#000 75%,#0000 0) -2rem -2rem",
  "conic-gradient(at calc(2*4rem) calc(2*4rem),#000 75%,#0000 0) -4rem -4rem",
  "conic-gradient(from -45deg at 1rem 1rem,#0000 25%,#000 0) -1rem 0/100% 51% repeat-x,conic-gradient(from 135deg at 1rem calc(100% - 1rem),#0000 25%,#000 0) -1rem 100%/100% 51% repeat-x",
  "conic-gradient(from -45deg at 2rem 2rem,#0000 25%,#000 0) -2rem 0/100% 51% repeat-x,conic-gradient(from 135deg at 2rem calc(100% - 2rem),#0000 25%,#000 0) -2rem 100%/100% 51% repeat-x",
  "conic-gradient(from -45deg at 4rem 4rem,#0000 25%,#000 0) -4rem 0/100% 51% repeat-x,conic-gradient(from 135deg at 4rem calc(100% - 4rem),#0000 25%,#000 0) -4rem 100%/100% 51% repeat-x",
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

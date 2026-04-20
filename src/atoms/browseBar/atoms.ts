// services, features, and other libraries
import { Effect } from "effect";
import { Atom } from "@effect-atom/atom-react";
import { RuntimeAtom } from "@/lib/RuntimeClient";

// types
import type { NotesPageSchemaT } from "@/features/notes/schemas/notesPage";

export type BrowseBar = Pick<NotesPageSchemaT["searchParams"], "str" | "crp" | "fbt" | "sbf" | "sbd">;

// constants
export const INIT_BROWSE_BAR = { str: "", crp: 1, fbt: [], sbf: "updated_at" as const, sbd: "desc" as const } as const satisfies BrowseBar;

// Master atom storing browse bar state
export const browseBarAtom = Atom.make<BrowseBar>(INIT_BROWSE_BAR).pipe(Atom.keepAlive);

// Mutation atom that syncs the master atom to the URL search params after a 3s debounce
export const syncToUrlBrowseBarAtom = RuntimeAtom.fn(
  Effect.fnUntraced(function* (newValue, get: Atom.FnContext) {
    const curValue = get(browseBarAtom);
    get.set(browseBarAtom, { ...curValue, ...newValue });
    yield* Effect.sleep("3 seconds");

    yield* Effect.log(`[BROWSE BAR URL SYNC]: ${JSON.stringify({ ...curValue, ...newValue })}`);
  })
);

// Granular selectors derived from the master atom to minimize unnecessary re-renders
export const selStrAtom = browseBarAtom.pipe(Atom.map((state) => state.str));
export const selCrpAtom = browseBarAtom.pipe(Atom.map((state) => state.crp));
export const selFbtAtom = browseBarAtom.pipe(Atom.map((state) => state.fbt));
export const selSbfAtom = browseBarAtom.pipe(Atom.map((state) => state.sbf));
export const selSbdAtom = browseBarAtom.pipe(Atom.map((state) => state.sbd));

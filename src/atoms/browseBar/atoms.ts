// services, features, and other libraries
import { Effect } from "effect";
import { Atom } from "@effect-atom/atom-react";
import { RuntimeAtom } from "@/lib/RuntimeClient";

// types
import type { NotesPageSchemaT } from "@/features/notes/schemas/notesPage";
import type useUrlScribe from "@/hooks/useUrlScribe";

export type BrowseBar = Pick<NotesPageSchemaT["searchParams"], "str" | "crp" | "fbt" | "sbf" | "sbd">;

// constants
export const INIT_BROWSE_BAR = { str: "", crp: 1, fbt: [], sbf: "updated_at" as const, sbd: "desc" as const } as const satisfies BrowseBar;

// Master atom storing browse bar state
export const browseBarAtom = Atom.make<BrowseBar>(INIT_BROWSE_BAR).pipe(Atom.keepAlive);

// Mutation atom that syncs the master atom to the URL search params after a 3s debounce
export const syncToUrlBrowseBarAtom = RuntimeAtom.fn(
  Effect.fnUntraced(function* (
    { update, navigate }: { update: Partial<BrowseBar>; navigate: ReturnType<typeof useUrlScribe>["navigate"] },
    get: Atom.FnContext
  ) {
    // Update the master atom right away to provide immediate feedback in the UI
    const result = get(browseBarAtom);
    get.set(browseBarAtom, { ...result, ...update });

    yield* Effect.sleep("3 seconds");

    yield* Effect.log(`[BROWSE BAR URL SYNC]: ${JSON.stringify({ ...result, ...update })}`);

    yield* Effect.sync(() => navigate("/notes", { ...result, ...update }));
  })
);

// Granular selectors derived from the master atom to minimize unnecessary re-renders
export const browseBarStrAtom = browseBarAtom.pipe(Atom.map((state) => state.str));
export const browseBarCrpAtom = browseBarAtom.pipe(Atom.map((state) => state.crp));
export const browseBarFbtAtom = browseBarAtom.pipe(Atom.map((state) => state.fbt));
export const browseBarSbfAtom = browseBarAtom.pipe(Atom.map((state) => state.sbf));
export const browseBarSbdAtom = browseBarAtom.pipe(Atom.map((state) => state.sbd));

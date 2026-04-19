// services, features, and other libraries
import { Effect, Option } from "effect";
import { Atom } from "@effect-atom/atom-react";
import { RuntimeAtom } from "@/lib/RuntimeClient";
import { RpcNotesClient } from "@/features/notes/rpc/client";

// Master atom storing note tags, using a writable family that persists its value on refresh
export const noteTagsAtom = Atom.family(() =>
  Atom.writable<string[], string[]>(
    (get) => Option.getOrElse(get.self(), () => []),
    (ctx, value) => ctx.setSelf(value)
  ).pipe(Atom.keepAlive)
);

// Optimistic view of the master atom for immediate UI feedback and automatic rollback
export const optiNoteTagsAtom = Atom.family((noteId: string) => Atom.optimistic(noteTagsAtom(noteId)));

// Async atom for debounced server sync, utilizing optimisticFn for UI/DB coordination
export const syncToDbNoteTagsAtom = Atom.family((noteId: string) =>
  Atom.optimisticFn(optiNoteTagsAtom(noteId), {
    reducer: (_, value: string[]) => value,
    fn: RuntimeAtom.fn((_, get) =>
      Effect.gen(function* () {
        yield* Effect.sleep("3 seconds");

        // Retrieve the finalized state from the optimistic atom for commitment
        const value = get(optiNoteTagsAtom(noteId));

        const { syncToDbNoteTags } = yield* RpcNotesClient;
        yield* syncToDbNoteTags({ noteId, tags: value });

        yield* Effect.log(`[DB SYNC] Saving note tags for ${noteId}: ${JSON.stringify(value)}`);

        get.set(noteTagsAtom(noteId), value);
      })
    ),
  })
);

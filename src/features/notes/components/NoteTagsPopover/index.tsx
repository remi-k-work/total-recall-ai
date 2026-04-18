"use client";

// react
import { startTransition, useMemo } from "react";

// services, features, and other libraries
import { Effect, Option } from "effect";
import { Atom, useAtomInitialValues, useAtomSet, useAtomValue } from "@effect-atom/atom-react";
import { RuntimeAtom } from "@/lib/RuntimeClient";
import { RpcNotesClient } from "@/features/notes/rpc/client";

// components
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/custom/popover";
import { Badge } from "@/components/ui/custom/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/custom/toggle-group";

// assets
import { TagIcon } from "@heroicons/react/24/outline";

// types
import type { AvailNoteTags, NoteDetails, NoteWithPagination } from "@/features/notes/db";

interface NoteTagsPopoverProps {
  note: NoteWithPagination | NoteDetails;
  availNoteTags: AvailNoteTags;
}

// Master atom storing tags associated with this note; we use a writable atom that retains its value on refresh
const noteTagsAtom = Atom.family(() =>
  Atom.writable<string[], string[]>(
    (get) => Option.getOrElse(get.self(), () => []),
    (ctx, value) => ctx.setSelf(value)
  )
);

// Optimistic view of the above atom, providing immediate feedback and automatic rollback
const optiNoteTagsAtom = Atom.family((noteId: string) => Atom.optimistic(noteTagsAtom(noteId)));

// Sync function for orchestrating optimistic UI updates and debounced server-side synchronization
const syncToDbAtom = Atom.family((noteId: string) =>
  Atom.optimisticFn(optiNoteTagsAtom(noteId), {
    // Immediate UI update to the target state
    reducer: (current, update: string[]) => update,
    // Async synchronization with built-in 3s debouncing and failure-aware rollback
    fn: RuntimeAtom.fn((value, get) =>
      Effect.gen(function* () {
        // Consolidate rapid updates into a single sync
        yield* Effect.sleep("3 seconds");

        // Persist the state change to the server or trigger an automatic UI rollback in case of failure
        const { syncToDbNoteTags } = yield* RpcNotesClient;
        yield* syncToDbNoteTags({ noteId, tags: value });

        // Finalize the committed state upon successful sync
        get.set(noteTagsAtom(noteId), value);
      })
    ),
  })
);

export default function NoteTagsPopover({ note, note: { id: noteId }, availNoteTags }: NoteTagsPopoverProps) {
  // Seed the master atom with the server-rendered tag state on mount
  const tagIds = useMemo(() => ("contentPreview" in note ? note.tags.map(({ id }) => id) : note.noteToNoteTag.map(({ noteTagId }) => noteTagId)), [note]);
  useAtomInitialValues([[noteTagsAtom(noteId), tagIds]]);

  // Reactive subscription to the optimistic UI state
  const optiNoteTags = useAtomValue(optiNoteTagsAtom(noteId));

  // Setter action for initiating tag toggles
  const syncToDb = useAtomSet(syncToDbAtom(noteId));

  // Derived list of selected tag objects for rendering badges
  const selectedNoteTags = useMemo(() => {
    const selectedSet = new Set(optiNoteTags);
    return availNoteTags.filter(({ id }) => selectedSet.has(id));
  }, [optiNoteTags, availNoteTags]);

  return (
    <Popover>
      <PopoverTrigger className="flex w-96 flex-wrap items-center justify-center gap-2">
        {selectedNoteTags.length === 0 ? (
          <Badge variant="outline" className="w-full p-3 uppercase">
            <TagIcon className="size-9" />
            Add Tags...
          </Badge>
        ) : (
          selectedNoteTags.map(({ id, name }) => <Badge key={id}>{name}</Badge>)
        )}
      </PopoverTrigger>
      <PopoverContent side="top" className="w-96">
        <ToggleGroup
          multiple
          value={optiNoteTags}
          // Initiate the optimistic update within a transition for non-blocking rendering
          onValueChange={(value) => startTransition(() => syncToDb(value))}
          className="w-full flex-wrap justify-center"
        >
          {availNoteTags.map(({ id, name }) => (
            <ToggleGroupItem key={id} value={id} aria-label={`Toggle: ${name}`} title={`Toggle: ${name}`}>
              {name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </PopoverContent>
    </Popover>
  );
}

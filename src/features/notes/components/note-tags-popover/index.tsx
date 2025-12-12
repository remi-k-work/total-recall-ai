"use client";

// react
import { startTransition, useMemo, useOptimistic, useState } from "react";

// server actions and mutations
import syncNoteTags from "@/features/notes/actions/syncNoteTags";

// services, features, and other libraries
import { useDebouncedCallback } from "use-debounce";

// components
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/custom/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/custom/toggle-group";

// assets
import { TagIcon } from "@heroicons/react/24/outline";

// types
import type { getAvailNoteTags, getNotesWithPagination } from "@/features/notes/db";

interface NoteTagsPopoverProps {
  noteId: Awaited<ReturnType<typeof getNotesWithPagination>>["notes"][number]["id"];
  currNoteTagIds: Awaited<ReturnType<typeof getNotesWithPagination>>["notes"][number]["tags"][number]["id"][];
  availNoteTags: Awaited<ReturnType<typeof getAvailNoteTags>>;
}

export default function NoteTagsPopover({ noteId, currNoteTagIds, availNoteTags }: NoteTagsPopoverProps) {
  // Optimistic state, used to track the currently toggled tags - we initialize it with the current note tags
  const [currToggledTagIds, setCurrToggledTagIds] = useState(currNoteTagIds);
  const [optiToggledTagIds, setOptiToggledTagIds] = useOptimistic(currToggledTagIds);

  // Note tags that are currently selected - we use useMemo here because filtering arrays on every render is expensive
  const selectedNoteTags = useMemo(() => {
    // Performance optimization (O(N) -> O(1) lookup)
    const selectedSet = new Set(optiToggledTagIds);

    // Retain only the tags that are currently selected from the complete list of available note tags for this user
    return availNoteTags.filter(({ id }) => selectedSet.has(id));
  }, [optiToggledTagIds, availNoteTags]);

  // Use the debounced callback to initiate the relevant actions
  const handleToggledNoteTags = useDebouncedCallback(async (noteTagIds: string[]) => {
    // This action syncs the tags for a note (useful when the UI sends a full list of tags)
    if ((await syncNoteTags(noteId, noteTagIds)).actionStatus === "failed") setCurrToggledTagIds(currNoteTagIds);
  }, 3000);

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
          type="multiple"
          spacing={2}
          value={optiToggledTagIds}
          onValueChange={(value) => {
            startTransition(() => {
              // Immediate UI update of the toggled tags
              setOptiToggledTagIds(value);
            });

            // Debounced server update of the toggled tags
            setCurrToggledTagIds(value);
            handleToggledNoteTags(value);
          }}
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

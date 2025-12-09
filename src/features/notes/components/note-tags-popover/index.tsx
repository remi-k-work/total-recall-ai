"use client";

// react
import { startTransition, useOptimistic } from "react";

// server actions and mutations
import syncNoteTags from "@/features/notes/actions/syncNoteTags";

// components
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/custom/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/custom/toggle-group";

// assets
import { TagIcon } from "@heroicons/react/24/outline";

// types
import type { getAllNoteTags, getNotesWithPagination } from "@/features/notes/db";

interface NoteTagsPopoverProps {
  noteId: Awaited<ReturnType<typeof getNotesWithPagination>>["notes"][number]["id"];
  currTags: Awaited<ReturnType<typeof getNotesWithPagination>>["notes"][number]["tags"];
  noteTags: Awaited<ReturnType<typeof getAllNoteTags>>;
}

export default function NoteTagsPopover({ noteId, currTags, noteTags }: NoteTagsPopoverProps) {
  const [optimisticSelectedTagIds, setOptimisticSelectedTagIds] = useOptimistic(currTags.map(({ id }) => id));

  // Note tags that are currently selected
  const selectedNoteTags = noteTags.filter(({ id }) => optimisticSelectedTagIds.includes(id));

  return (
    <Popover>
      <PopoverTrigger className="flex w-96 flex-wrap items-center justify-center gap-2">
        {selectedNoteTags.length === 0 ? (
          <Badge variant="outline" className="uppercase">
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
          value={optimisticSelectedTagIds}
          onValueChange={(value) =>
            startTransition(async () => {
              setOptimisticSelectedTagIds(value);
              // This action syncs the tags for a note (useful when the UI sends a full list of tags)
              await syncNoteTags(noteId, value);
            })
          }
          className="w-full flex-wrap justify-center"
        >
          {noteTags.map(({ id, name }) => (
            <ToggleGroupItem key={id} value={id} aria-label={`Toggle Tag: ${name}`} title={`Toggle Tag: ${name}`}>
              {name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </PopoverContent>
    </Popover>
  );
}

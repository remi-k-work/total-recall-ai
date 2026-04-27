"use client";

// react
import { startTransition } from "react";

// services, features, and other libraries
import { useNoteTags } from "@/atoms";

// components
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/custom/popover";
import { Badge } from "@/components/ui/custom/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/custom/toggle-group";

// types
import type { AvailNoteTags, NoteDetails, NoteWithPagination } from "@/features/notes/db";

interface NoteTagsPopoverProps {
  note: NoteWithPagination | NoteDetails;
  availNoteTags: AvailNoteTags;
}

export default function NoteTagsPopover({ note, availNoteTags }: NoteTagsPopoverProps) {
  // Manages note tags, including hydration, zero-read setter actions, and debounced database synchronization
  const { optiNoteTags, selectedTags, syncToDbNoteTags } = useNoteTags(note, availNoteTags);

  return (
    <Popover>
      <PopoverTrigger
        className="group flex w-96 flex-wrap items-center justify-center gap-2 rounded-md p-3 transition-colors duration-1000 ease-in-out hover:bg-accent"
        title="🏷️ Apply Tags to this Note"
      >
        {selectedTags.length === 0 ? (
          <Badge variant="outline" className="w-full p-3 transition-colors duration-1000 ease-in-out group-hover:text-accent-foreground">
            🏷️ Apply Tags to this Note
          </Badge>
        ) : (
          selectedTags.map(({ id, name }) => <Badge key={id}>{name}</Badge>)
        )}
      </PopoverTrigger>
      <PopoverContent className="max-h-96 w-96 overflow-y-auto">
        <ToggleGroup
          multiple
          value={optiNoteTags}
          // Initiate the optimistic update within a transition for non-blocking rendering
          onValueChange={(value) => startTransition(() => syncToDbNoteTags(value))}
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

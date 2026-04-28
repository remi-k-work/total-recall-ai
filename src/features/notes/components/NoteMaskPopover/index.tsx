"use client";

// services, features, and other libraries
import { notePrefsMaskAtom, useNotePrefs } from "@/atoms";
import { useAtomValue } from "@effect-atom/atom-react";

// components
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/custom/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/custom/toggle-group";

// types
import type { NoteDetails, NoteWithPagination } from "@/features/notes/db";

interface NoteMaskPopoverProps {
  note: NoteWithPagination | NoteDetails;
}

// constants
import { NOTE_PREFS_MASKS } from "@/atoms";

export default function NoteMaskPopover({ note, note: { id: noteId } }: NoteMaskPopoverProps) {
  // Manages note preferences, including hydration, zero-read setter actions, and debounced database synchronization
  const curNoteMask = useAtomValue(notePrefsMaskAtom(noteId)) ?? "*";
  const { changedMask } = useNotePrefs(note);

  return (
    <Popover>
      <PopoverTrigger
        className="size-20 bg-background transition-colors duration-1000 ease-in-out hover:bg-accent"
        style={{ WebkitMask: curNoteMask === "*" ? undefined : curNoteMask }}
        aria-label="🎭 Change Note Mask"
        title="🎭 Change Note Mask"
      />
      <PopoverContent className="max-h-96 w-96 overflow-y-auto">
        <ToggleGroup value={[curNoteMask]} onValueChange={([newNoteMask]) => changedMask(newNoteMask)} className="w-full flex-wrap justify-center gap-3">
          {NOTE_PREFS_MASKS.map((mask, index) => (
            <ToggleGroupItem
              key={index}
              value={mask}
              className="size-20 bg-background transition-colors duration-1000 ease-in-out hover:bg-accent"
              style={{ WebkitMask: mask === "*" ? undefined : mask }}
              aria-label="🎭 Change to this Mask"
              title="🎭 Change to this Mask"
            />
          ))}
        </ToggleGroup>
      </PopoverContent>
    </Popover>
  );
}

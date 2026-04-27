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
  const curNoteMask = useAtomValue(notePrefsMaskAtom(noteId)) ?? NOTE_PREFS_MASKS[0];
  const { changedMask } = useNotePrefs(note);

  return (
    <Popover>
      <PopoverTrigger
        className="size-20 bg-background transition-colors duration-1000 ease-in-out hover:bg-accent"
        style={{ WebkitMask: curNoteMask }}
        title="Choose a note mask"
      />
      <PopoverContent side="top" className="w-96">
        <ToggleGroup value={[curNoteMask]} onValueChange={([newNoteMask]) => changedMask(newNoteMask)} className="w-full flex-wrap justify-center gap-3">
          {NOTE_PREFS_MASKS.map((mask, index) => (
            <ToggleGroupItem
              key={index}
              value={mask}
              aria-label="Choose this note mask"
              title="Choose this note mask"
              className="size-20 bg-background transition-colors duration-1000 ease-in-out hover:bg-accent"
              style={{ WebkitMask: mask }}
            />
          ))}
        </ToggleGroup>
      </PopoverContent>
    </Popover>
  );
}

"use client";

// services, features, and other libraries
import { notePrefsBorderAtom, useNotePrefs } from "@/atoms";
import { useAtomValue } from "@effect-atom/atom-react";

// components
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/custom/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/custom/toggle-group";

// types
import type { NoteDetails, NoteWithPagination } from "@/features/notes/db";

interface NoteBorderPopoverProps {
  note: NoteWithPagination | NoteDetails;
}

// constants
import { NOTE_PREFS_BORDERS } from "@/atoms";

export default function NoteBorderPopover({ note, note: { id: noteId } }: NoteBorderPopoverProps) {
  // Manages note preferences, including hydration, zero-read setter actions, and debounced database synchronization
  const curNoteBorder = useAtomValue(notePrefsBorderAtom(noteId)) ?? NOTE_PREFS_BORDERS[0];
  const { changedBorder } = useNotePrefs(note);

  return (
    <Popover>
      <PopoverTrigger
        className="size-12 border-2 border-accent bg-background transition-colors duration-1000 ease-in-out hover:bg-accent"
        style={{ borderRadius: curNoteBorder }}
        title="Choose a border style"
      />
      <PopoverContent side="top" className="w-96">
        <ToggleGroup
          value={[curNoteBorder]}
          onValueChange={([newNoteBorder]) => changedBorder(newNoteBorder)}
          className="w-full flex-wrap justify-center gap-3"
        >
          {NOTE_PREFS_BORDERS.map((border, index) => (
            <ToggleGroupItem
              key={index}
              value={border}
              aria-label="Choose this border style"
              title="Choose this border style"
              className="size-12 border-2 border-accent bg-background hover:bg-accent"
              style={{ borderRadius: border }}
            />
          ))}
        </ToggleGroup>
      </PopoverContent>
    </Popover>
  );
}

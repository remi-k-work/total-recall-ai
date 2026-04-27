"use client";

// services, features, and other libraries
import { notePrefsBorderAtom, notePrefsColorAtom, notePrefsMaskAtom } from "@/atoms";
import { useAtomValue } from "@effect-atom/atom-react";

// components
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/custom/card";
import { MessageResponse } from "@/components/ai-elements/custom/message";
import ColorPicker from "./ColorPicker";
import NoteBorderPopover from "./NoteBorderPopover";
import NoteMaskPopover from "./NoteMaskPopover";
import NoteTagsPopover from "./NoteTagsPopover";
import DateTimeAt from "@/components/DateTimeAt";

// assets
import { CalendarIcon } from "@heroicons/react/24/outline";

// types
import type { AvailNoteTags, NoteDetails } from "@/features/notes/db";
import type { CSSProperties } from "react";

interface NoteDetailsProps {
  note: NoteDetails;
  availNoteTags: AvailNoteTags;
  inNoteModal?: boolean;
}

// constants
import { NOTE_PREFS_BORDERS, NOTE_PREFS_MASKS } from "@/atoms";

export default function NoteDetails({
  note,
  note: { id: noteId, title, content, createdAt, updatedAt },
  availNoteTags,
  inNoteModal = false,
}: NoteDetailsProps) {
  // Manages note preferences, including hydration, zero-read setter actions, and debounced database synchronization
  const curNoteColor = useAtomValue(notePrefsColorAtom(noteId)) ?? undefined;
  const curNoteBorder = useAtomValue(notePrefsBorderAtom(noteId)) ?? NOTE_PREFS_BORDERS[0];
  const curNoteMask = useAtomValue(notePrefsMaskAtom(noteId)) ?? NOTE_PREFS_MASKS[0];

  const noteStyle = { backgroundColor: curNoteColor, borderRadius: curNoteBorder, WebkitMask: curNoteMask } as const satisfies CSSProperties;

  return (
    <Card className="max-w-2xl overflow-clip" style={noteStyle}>
      {!inNoteModal && (
        <CardHeader>
          <CardTitle className="text-muted-foreground normal-case">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <MessageResponse>{content}</MessageResponse>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-around gap-6 border-t pt-6">
        <ColorPicker note={note} />
        <NoteBorderPopover note={note} />
        <NoteMaskPopover note={note} />
        <NoteTagsPopover note={note} availNoteTags={availNoteTags} />
        <DateTimeAt icon={<CalendarIcon className="size-9" />} title="Created At" date={createdAt} />
        <DateTimeAt icon={<CalendarIcon className="size-9" />} title="Updated At" date={updatedAt} />
      </CardFooter>
    </Card>
  );
}

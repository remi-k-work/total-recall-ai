"use client";

// services, features, and other libraries
import { notePrefsColorAtom } from "@/atoms";
import { useAtomValue } from "@effect-atom/atom-react";

// components
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/custom/card";
import { MessageResponse } from "@/components/ai-elements/custom/message";
import ColorPicker from "./ColorPicker";
import NoteTagsPopover from "./NoteTagsPopover";
import DateTimeAt from "@/components/DateTimeAt";

// assets
import { CalendarIcon } from "@heroicons/react/24/outline";

// types
import type { AvailNoteTags, NoteDetails } from "@/features/notes/db";

interface NoteDetailsProps {
  note: NoteDetails;
  availNoteTags: AvailNoteTags;
  inNoteModal?: boolean;
}

export default function NoteDetails({
  note,
  note: { id: noteId, title, content, createdAt, updatedAt },
  availNoteTags,
  inNoteModal = false,
}: NoteDetailsProps) {
  // Manages note preferences, including hydration, zero-read setter actions, and debounced database synchronization
  const color = useAtomValue(notePrefsColorAtom(noteId));

  return (
    <Card className="max-w-2xl rounded-[255px_15px_225px_15px/15px_225px_15px_255px]" style={color ? { backgroundColor: color } : undefined}>
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
        <NoteTagsPopover note={note} availNoteTags={availNoteTags} />
        <DateTimeAt icon={<CalendarIcon className="size-9" />} title="Created At" date={createdAt} />
        <DateTimeAt icon={<CalendarIcon className="size-9" />} title="Updated At" date={updatedAt} />
      </CardFooter>
    </Card>
  );
}

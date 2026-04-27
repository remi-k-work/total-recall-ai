"use client";

// next
import Link from "next/link";

// services, features, and other libraries
import useUrlScribe from "@/hooks/useUrlScribe";
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
import type { AvailNoteTags, NoteWithPagination } from "@/features/notes/db";
import type { CSSProperties } from "react";
import type { Route } from "next";

interface NotePreviewProps {
  note: NoteWithPagination;
  availNoteTags: AvailNoteTags;
}

// constants
import { NOTE_PREFS_BORDERS, NOTE_PREFS_MASKS } from "@/atoms";

export default function NotePreview({ note, note: { id: noteId, title, contentPreview, createdAt, updatedAt }, availNoteTags }: NotePreviewProps) {
  // A hook to easily create new route strings with updated search parameters (it preserves existing search params)
  const { createHref } = useUrlScribe();

  // Manages note preferences, including hydration, zero-read setter actions, and debounced database synchronization
  const curNoteColor = useAtomValue(notePrefsColorAtom(noteId)) ?? undefined;
  const curNoteBorder = useAtomValue(notePrefsBorderAtom(noteId)) ?? NOTE_PREFS_BORDERS[0];
  const curNoteMask = useAtomValue(notePrefsMaskAtom(noteId)) ?? NOTE_PREFS_MASKS[0];

  const noteStyle = { backgroundColor: curNoteColor, borderRadius: curNoteBorder, WebkitMask: curNoteMask } as const satisfies CSSProperties;

  return (
    <Card className="mb-4 break-inside-avoid overflow-clip" style={noteStyle}>
      <CardHeader>
        <CardTitle>
          <Link href={createHref(`/notes/${noteId}` as Route)} className="link text-3xl leading-none font-normal normal-case">
            {title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-72 overflow-clip">
        <MessageResponse>{contentPreview}</MessageResponse>
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

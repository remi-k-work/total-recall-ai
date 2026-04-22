"use client";

// next
import Link from "next/link";

// services, features, and other libraries
import useUrlScribe from "@/hooks/useUrlScribe";
import { notePrefsColorAtom } from "@/atoms";
import { useAtomValue } from "@effect-atom/atom-react";

// components
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/custom/card";
import { MessageResponse } from "@/components/ai-elements/custom/message";
import ColorPicker from "./ColorPicker";
import NoteTagsPopover from "./NoteTagsPopover";
import CreatedAt from "./CreatedAt";
import UpdatedAt from "./UpdatedAt";

// types
import type { AvailNoteTags, NoteWithPagination } from "@/features/notes/db";
import type { Route } from "next";

interface NotePreviewProps {
  note: NoteWithPagination;
  availNoteTags: AvailNoteTags;
}

export default function NotePreview({ note, note: { id: noteId, title, contentPreview, createdAt, updatedAt }, availNoteTags }: NotePreviewProps) {
  // A hook to easily create new route strings with updated search parameters (it preserves existing search params)
  const { createHref } = useUrlScribe();

  // Manages note preferences, including hydration, zero-read setter actions, and debounced database synchronization
  const color = useAtomValue(notePrefsColorAtom(noteId));

  return (
    <Card className="mb-4 break-inside-avoid rounded-[255px_15px_225px_15px/15px_225px_15px_255px]" style={color ? { backgroundColor: color } : undefined}>
      <CardHeader>
        <CardTitle>
          <Link href={createHref(`/notes/${noteId}` as Route)} className="link text-3xl leading-none font-normal normal-case">
            {title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="line-clamp-6">
        <MessageResponse>{contentPreview}</MessageResponse>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-around gap-6 border-t pt-6">
        <ColorPicker note={note} />
        <NoteTagsPopover note={note} availNoteTags={availNoteTags} />
        <CreatedAt createdAt={createdAt} />
        <UpdatedAt updatedAt={updatedAt} />
      </CardFooter>
    </Card>
  );
}

"use client";

// next
import Link from "next/link";

// services, features, and other libraries
import { useNotePreferencesStore } from "@/features/notes/stores/NotePreferencesProvider";
import useUrlScribe from "@/hooks/useUrlScribe";

// components
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/custom/card";
import { Response } from "@/components/ai-elements/response";
import ColorPicker from "./ColorPicker";
import NoteTagsPopover from "./note-tags-popover";
import CreatedAt from "./CreatedAt";
import UpdatedAt from "./UpdatedAt";

// types
import type { getAvailNoteTags, getNotesWithPagination } from "@/features/notes/db";
import type { Route } from "next";

interface NotePreviewProps {
  note: Awaited<ReturnType<typeof getNotesWithPagination>>["notes"][number];
  availNoteTags: Awaited<ReturnType<typeof getAvailNoteTags>>;
}

// constants
import { REHYPE_PLUGINS } from "@/features/notes-assistant/constants/plugins";

export default function NotePreview({ note: { id: noteId, title, contentPreview, createdAt, updatedAt, tags }, availNoteTags }: NotePreviewProps) {
  // Retrieve the necessary state and actions from the note preferences store
  const color = useNotePreferencesStore((state) => state.color);

  // A hook to easily create new route strings with updated search parameters (it preserves existing search params)
  const { createHref } = useUrlScribe();

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
        <Response rehypePlugins={REHYPE_PLUGINS}>{contentPreview}</Response>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-around gap-6 border-t pt-6">
        <ColorPicker />
        <NoteTagsPopover noteId={noteId} currNoteTagIds={tags.map(({ id }) => id)} availNoteTags={availNoteTags} />
        <CreatedAt createdAt={createdAt} />
        <UpdatedAt updatedAt={updatedAt} />
      </CardFooter>
    </Card>
  );
}

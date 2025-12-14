"use client";

// services, features, and other libraries
import { useNotePreferencesStore } from "@/features/notes/stores/NotePreferencesProvider";

// components
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/custom/card";
import { Response } from "@/components/ai-elements/response";
import ColorPicker from "./ColorPicker";
import NoteTagsPopover from "./note-tags-popover";
import CreatedAt from "./CreatedAt";
import UpdatedAt from "./UpdatedAt";

// types
import type { getAvailNoteTags, getNote } from "@/features/notes/db";

interface NoteDetailsProps {
  note: Exclude<Awaited<ReturnType<typeof getNote>>, undefined>;
  availNoteTags: Awaited<ReturnType<typeof getAvailNoteTags>>;
  inNoteModal?: boolean;
}

// constants
import { REHYPE_PLUGINS } from "@/features/notes-assistant/constants/plugins";

export default function NoteDetails({
  note: { id: noteId, title, content, createdAt, updatedAt, noteToNoteTag },
  availNoteTags,
  inNoteModal = false,
}: NoteDetailsProps) {
  // Retrieve the necessary state and actions from the note preferences store
  const color = useNotePreferencesStore((state) => state.color);

  return (
    <Card className="max-w-2xl rounded-[255px_15px_225px_15px/15px_225px_15px_255px]" style={color ? { backgroundColor: color } : undefined}>
      {!inNoteModal && (
        <CardHeader>
          <CardTitle className="text-muted-foreground normal-case">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <Response rehypePlugins={REHYPE_PLUGINS}>{content}</Response>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-around gap-6 border-t pt-6">
        <ColorPicker />
        <NoteTagsPopover noteId={noteId} currNoteTagIds={noteToNoteTag.map(({ noteTagId }) => noteTagId)} availNoteTags={availNoteTags} />
        <CreatedAt createdAt={createdAt} />
        <UpdatedAt updatedAt={updatedAt} />
      </CardFooter>
    </Card>
  );
}

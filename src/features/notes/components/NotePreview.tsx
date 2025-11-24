"use client";

// services, features, and other libraries
import { useNotePreferencesStore } from "@/features/notes/stores/NotePreferencesProvider";
import { format } from "date-fns";

// components
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/custom/card";
import { Response } from "@/components/ai-elements/response";
import ColorPicker from "./ColorPicker";

// assets
import { CalendarIcon } from "@heroicons/react/24/outline";

// types
import type { getNotesWithPagination } from "@/features/notes/db";

interface NotePreviewProps {
  note: Awaited<ReturnType<typeof getNotesWithPagination>>["notes"][number];
}

// constants
import { REHYPE_PLUGINS } from "@/features/notes-assistant/constants/plugins";

export default function NotePreview({ note: { title, contentPreview, createdAt, updatedAt } }: NotePreviewProps) {
  // Retrieve the necessary state and actions from the note preferences store
  const color = useNotePreferencesStore((state) => state.color);

  return (
    <Card className="rounded-[255px_15px_225px_15px_/_15px_225px_15px_255px]" style={{ backgroundColor: color }}>
      <CardHeader>
        <CardTitle className="text-muted-foreground normal-case">{title}</CardTitle>
      </CardHeader>
      <CardContent className="line-clamp-6">
        <Response rehypePlugins={REHYPE_PLUGINS}>{contentPreview}</Response>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-around gap-6 border-t pt-6">
        <ColorPicker />
        <section>
          <div className="flex items-center justify-center gap-2 uppercase">
            <CalendarIcon className="size-9" />
            Created At
          </div>
          <p className="text-muted-foreground text-center">{format(createdAt, "MMMM d, yyyy")}</p>
        </section>
        <section>
          <div className="flex items-center justify-center gap-2 uppercase">
            <CalendarIcon className="size-9" />
            Updated At
          </div>
          <p className="text-muted-foreground text-center">{format(updatedAt, "MMMM d, yyyy")}</p>
        </section>
      </CardFooter>
    </Card>
  );
}

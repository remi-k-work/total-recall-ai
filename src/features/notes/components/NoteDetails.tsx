"use client";

// services, features, and other libraries
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

// components
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/custom/card";
import { Response } from "@/components/ai-elements/response";

// assets
import { CalendarIcon } from "@heroicons/react/24/outline";

// types
import type { getNote } from "@/features/notes/db";

interface NoteDetailsProps {
  note?: Exclude<Awaited<ReturnType<typeof getNote>>, undefined>;
  noteId?: string;
}

// constants
import { REHYPE_PLUGINS } from "@/features/notes-assistant/constants/plugins";

export default function NoteDetails({ note, noteId }: NoteDetailsProps) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["note", "details", noteId],
    queryFn: async ({ signal }): Promise<Awaited<ReturnType<typeof getNote>>> => {
      const res = await fetch(`/api/notes/${noteId}`, { credentials: "include", signal });
      if (!res.ok) throw new Error(res.statusText);
      return await res.json();
    },
    enabled: !!noteId,
  });

  if (isError) console.error(error);
  if (isLoading || isError) return null;
  if (!note && !data) return null;

  // If the note is already being provided by the server, use it instead
  const { title, content, createdAt, updatedAt } = note ?? data!;

  return (
    <Card className="max-w-2xl rounded-[255px_15px_225px_15px_/_15px_225px_15px_255px]">
      {/* The note has been passed from the server, which means we are in the full-page mode */}
      {note && (
        <CardHeader>
          <CardTitle className="text-muted-foreground normal-case">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <Response rehypePlugins={REHYPE_PLUGINS}>{content}</Response>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-around gap-6 border-t pt-6">
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

// services, features, and other libraries
import { format } from "date-fns";

// components
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/custom/card";

// assets
import { CalendarIcon } from "@heroicons/react/24/outline";

// types
import type { getNotesWithPagination } from "@/features/notes/db";

interface NotePreviewProps {
  note: Awaited<ReturnType<typeof getNotesWithPagination>>["notes"][number];
}

export default function NotePreview({ note: { title, contentPreview, updatedAt } }: NotePreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-6 whitespace-pre-line">{contentPreview}</p>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-center gap-2 uppercase">
          <CalendarIcon className="size-9" />
          Last Updated
        </div>
        <p className="text-muted-foreground text-center">{format(updatedAt, "MMMM d, yyyy")}</p>
      </CardFooter>
    </Card>
  );
}

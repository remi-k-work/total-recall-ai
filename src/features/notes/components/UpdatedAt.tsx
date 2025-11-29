// services, features, and other libraries
import { format } from "date-fns";

// assets
import { CalendarIcon } from "@heroicons/react/24/outline";

// types
import type { getNotesWithPagination } from "@/features/notes/db";

interface UpdatedAtProps {
  updatedAt: Awaited<ReturnType<typeof getNotesWithPagination>>["notes"][number]["updatedAt"];
}

export default function UpdatedAt({ updatedAt }: UpdatedAtProps) {
  return (
    <section className="bg-background rounded-[255px_15px_225px_15px/15px_225px_15px_255px] p-4">
      <div className="flex items-center justify-center gap-2 uppercase">
        <CalendarIcon className="size-9" />
        Updated At
      </div>
      <p className="text-muted-foreground text-center">{format(updatedAt, "MMMM d, yyyy, hh:mm a")}</p>
    </section>
  );
}

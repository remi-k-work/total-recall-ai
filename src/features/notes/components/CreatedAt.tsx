// services, features, and other libraries
import { format } from "date-fns";

// assets
import { CalendarIcon } from "@heroicons/react/24/outline";

// types
import type { getNotesWithPagination } from "@/features/notes/db";

interface CreatedAtProps {
  createdAt: Awaited<ReturnType<typeof getNotesWithPagination>>["notes"][number]["createdAt"];
}

export default function CreatedAt({ createdAt }: CreatedAtProps) {
  return (
    <section className="bg-background rounded-[255px_15px_225px_15px_/_15px_225px_15px_255px] p-3">
      <div className="flex items-center justify-center gap-2 uppercase">
        <CalendarIcon className="size-9" />
        Created At
      </div>
      <p className="text-muted-foreground text-center">{format(createdAt, "MMMM d, yyyy")}</p>
    </section>
  );
}

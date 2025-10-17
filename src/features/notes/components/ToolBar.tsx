"use client";

// next
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

// components
import { Button } from "@/components/ui/custom/button";

// assets
import { DocumentDuplicateIcon, DocumentPlusIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

export default function ToolBar() {
  // Get current route and note id (if present in url)
  const pathname = usePathname() as __next_route_internal_types__.RouteImpl<string>;
  const { id: noteId } = useParams<{ id?: string }>();

  // Check if user is on the main notes page
  const isNotesRoot = pathname === "/notes";

  // Check if user is viewing a specific note (not editing)
  const isNoteDetails = pathname.startsWith("/notes/") && noteId && !pathname.endsWith("/edit");

  return (
    <section className="flex items-center gap-2">
      <Button variant="ghost" className="flex-col" asChild>
        {isNotesRoot ? (
          <Link href="/notes/new">
            <DocumentPlusIcon className="size-11" />
            <p className="text-center whitespace-pre-line">{"New Note".replaceAll(" ", "\n")}</p>
          </Link>
        ) : (
          <Button type="button" variant="ghost" className="flex-col" disabled>
            <DocumentPlusIcon className="size-11" />
            <p className="text-center whitespace-pre-line">{"New Note".replaceAll(" ", "\n")}</p>
          </Button>
        )}
      </Button>
      <Button variant="ghost" className="flex-col" asChild>
        {isNoteDetails ? (
          <Link href={`/notes/${noteId}/edit`}>
            <DocumentTextIcon className="size-11" />
            <p className="text-center whitespace-pre-line">{"Edit Note".replaceAll(" ", "\n")}</p>
          </Link>
        ) : (
          <Button type="button" variant="ghost" className="flex-col" disabled>
            <DocumentTextIcon className="size-11" />
            <p className="text-center whitespace-pre-line">{"Edit Note".replaceAll(" ", "\n")}</p>
          </Button>
        )}
      </Button>
      <Button variant="ghost" className="flex-col" asChild>
        {!isNotesRoot ? (
          <Link href="/notes">
            <DocumentDuplicateIcon className="size-11" />
            <p className="text-center whitespace-pre-line">{"Go Back".replaceAll(" ", "\n")}</p>
          </Link>
        ) : (
          <Button type="button" variant="ghost" className="flex-col" disabled>
            <DocumentDuplicateIcon className="size-11" />
            <p className="text-center whitespace-pre-line">{"Go Back".replaceAll(" ", "\n")}</p>
          </Button>
        )}
      </Button>
    </section>
  );
}

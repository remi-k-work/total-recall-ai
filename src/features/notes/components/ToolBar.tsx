"use client";

// next
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

// components
import { Button } from "@/components/ui/custom/button";
import NotesAssistant from "./notes-assistant";

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
    <header className="mb-4 flex items-center justify-end gap-4">
      {isNotesRoot && (
        <>
          <Button variant="ghost" asChild>
            <Link href="/notes/new">
              <DocumentPlusIcon className="size-9" />
              Create New Note
            </Link>
          </Button>
          <NotesAssistant />
        </>
      )}
      {isNoteDetails && (
        <Button variant="ghost" asChild>
          <Link href={`/notes/${noteId}/edit`}>
            <DocumentTextIcon className="size-9" />
            Edit Note
          </Link>
        </Button>
      )}
      {!isNotesRoot && (
        <Button variant="ghost" asChild>
          <Link href="/notes">
            <DocumentDuplicateIcon className="size-9" />
            Go Back to Notes
          </Link>
        </Button>
      )}
    </header>
  );
}

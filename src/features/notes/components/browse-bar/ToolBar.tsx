// next
import Link from "next/link";

// services, features, and other libraries
import { useBrowseBarContext } from "./context";

// components
import { Button } from "@/components/ui/custom/button";

// assets
import { DocumentDuplicateIcon, DocumentPlusIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

export default function ToolBar() {
  // Access the browse bar context and retrieve all necessary information
  const browseBarContext = useBrowseBarContext();

  return (
    <section className="flex items-center gap-2">
      <Button variant="ghost" className="flex-col" asChild>
        {browseBarContext.kind === "notes-root" ? (
          <Link href="/notes/new" className="text-center whitespace-pre-line">
            <DocumentPlusIcon className="size-11" />
            {"New Note".replaceAll(" ", "\n")}
          </Link>
        ) : (
          <Button type="button" variant="ghost" className="flex-col whitespace-pre-line" disabled>
            <DocumentPlusIcon className="size-11" />
            {"New Note".replaceAll(" ", "\n")}
          </Button>
        )}
      </Button>
      <Button variant="ghost" className="flex-col" asChild>
        {browseBarContext.kind === "note-details" ? (
          <Link href={`/notes/${browseBarContext.noteId}/edit`} className="text-center whitespace-pre-line">
            <DocumentTextIcon className="size-11" />
            {"Edit Note".replaceAll(" ", "\n")}
          </Link>
        ) : (
          <Button type="button" variant="ghost" className="flex-col whitespace-pre-line" disabled>
            <DocumentTextIcon className="size-11" />
            {"Edit Note".replaceAll(" ", "\n")}
          </Button>
        )}
      </Button>
      <Button variant="ghost" className="flex-col" asChild>
        {browseBarContext.kind !== "notes-root" ? (
          <Link href="/notes" className="text-center whitespace-pre-line">
            <DocumentDuplicateIcon className="size-11" />
            {"Go Back".replaceAll(" ", "\n")}
          </Link>
        ) : (
          <Button type="button" variant="ghost" className="flex-col whitespace-pre-line" disabled>
            <DocumentDuplicateIcon className="size-11" />
            {"Go Back".replaceAll(" ", "\n")}
          </Button>
        )}
      </Button>
    </section>
  );
}

// next
import Link from "next/link";

// services, features, and other libraries
import { useBrowseBarContext } from "./context";

// components
import { Button } from "@/components/ui/custom/button";
import DeleteNote from "./DeleteNote";

// assets
import { DocumentDuplicateIcon, DocumentPlusIcon, DocumentTextIcon, TagIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function ToolBar() {
  // Access the browse bar context and retrieve all necessary information
  const browseBarContext = useBrowseBarContext();

  return (
    <section className="flex flex-wrap items-center justify-around gap-4 *:basis-24">
      {browseBarContext.kind === "notes-root" ? (
        <Button variant="ghost" className="flex-col text-center whitespace-pre-line" asChild>
          <Link href="/notes/new">
            <DocumentPlusIcon className="size-11" />
            {"New Note".replaceAll(" ", "\n")}
          </Link>
        </Button>
      ) : (
        <Button type="button" variant="ghost" className="flex-col whitespace-pre-line" disabled>
          <DocumentPlusIcon className="size-11" />
          {"New Note".replaceAll(" ", "\n")}
        </Button>
      )}

      {browseBarContext.kind === "note-details" ? (
        <>
          <Button variant="ghost" className="flex-col text-center whitespace-pre-line" asChild>
            <Link href={`/notes/${browseBarContext.noteId}/edit`}>
              <DocumentTextIcon className="size-11" />
              {"Edit Note".replaceAll(" ", "\n")}
            </Link>
          </Button>
          <DeleteNote />
        </>
      ) : (
        <>
          <Button type="button" variant="ghost" className="flex-col whitespace-pre-line" disabled>
            <DocumentTextIcon className="size-11" />
            {"Edit Note".replaceAll(" ", "\n")}
          </Button>
          <Button type="button" variant="destructive" className="flex-col whitespace-pre-line" disabled>
            <TrashIcon className="size-11" />
            {"Delete Note".replaceAll(" ", "\n")}
          </Button>
        </>
      )}

      {browseBarContext.kind !== "notes-root" ? (
        <Button variant="ghost" className="flex-col text-center whitespace-pre-line" asChild>
          <Link href="/notes">
            <DocumentDuplicateIcon className="size-11" />
            {"All Notes".replaceAll(" ", "\n")}
          </Link>
        </Button>
      ) : (
        <Button type="button" variant="ghost" className="flex-col whitespace-pre-line" disabled>
          <DocumentDuplicateIcon className="size-11" />
          {"All Notes".replaceAll(" ", "\n")}
        </Button>
      )}

      <Button variant="ghost" className="flex-col text-center whitespace-pre-line" asChild>
        <Link href="/note-tags">
          <TagIcon className="size-11" />
          {"Note Tags".replaceAll(" ", "\n")}
        </Link>
      </Button>
    </section>
  );
}

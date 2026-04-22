// next
import Link from "next/link";

// services, features, and other libraries
import useUrlScribe from "@/hooks/useUrlScribe";

// components
import { Button } from "@/components/ui/custom/button";
import DeleteNote from "./DeleteNote";

// assets
import { DocumentDuplicateIcon, DocumentPlusIcon, DocumentTextIcon, TagIcon, TrashIcon } from "@heroicons/react/24/outline";

// types
import type { Route } from "next";

interface Details {
  kind: "details";
  noteId: string;
}

interface Rest {
  kind: "root" | "new" | "edit";
}

type ToolBarProps = Details | Rest;

export default function ToolBar(props: ToolBarProps) {
  // A hook to easily create new route strings with updated search parameters (it preserves existing search params)
  const { createHref } = useUrlScribe();

  return (
    <section className="flex flex-wrap items-center justify-around gap-4 *:basis-24">
      {props.kind === "root" ? (
        <Button
          variant="ghost"
          nativeButton={false}
          className="flex-col text-center whitespace-pre-line"
          render={
            <Link href={createHref("/notes/new")}>
              <DocumentPlusIcon className="size-11" />
              {"New Note".replaceAll(" ", "\n")}
            </Link>
          }
        />
      ) : (
        <Button type="button" variant="ghost" className="flex-col whitespace-pre-line" disabled>
          <DocumentPlusIcon className="size-11" />
          {"New Note".replaceAll(" ", "\n")}
        </Button>
      )}

      {props.kind === "details" ? (
        <>
          <Button
            variant="ghost"
            nativeButton={false}
            className="flex-col text-center whitespace-pre-line"
            render={
              <Link href={createHref(`/notes/${props.noteId}/edit` as Route)}>
                <DocumentTextIcon className="size-11" />
                {"Edit Note".replaceAll(" ", "\n")}
              </Link>
            }
          />
          <DeleteNote noteId={props.noteId} />
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

      {props.kind !== "root" ? (
        <Button
          variant="ghost"
          nativeButton={false}
          className="flex-col text-center whitespace-pre-line"
          render={
            <Link href={createHref("/notes")}>
              <DocumentDuplicateIcon className="size-11" />
              {"All Notes".replaceAll(" ", "\n")}
            </Link>
          }
        />
      ) : (
        <Button type="button" variant="ghost" className="flex-col whitespace-pre-line" disabled>
          <DocumentDuplicateIcon className="size-11" />
          {"All Notes".replaceAll(" ", "\n")}
        </Button>
      )}

      <Button
        variant="ghost"
        nativeButton={false}
        className="flex-col text-center whitespace-pre-line"
        render={
          <Link href="/note-tags">
            <TagIcon className="size-11" />
            {"Note Tags".replaceAll(" ", "\n")}
          </Link>
        }
      />
    </section>
  );
}

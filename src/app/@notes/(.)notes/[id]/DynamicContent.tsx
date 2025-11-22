"use client";

// react
import { use } from "react";

export default function DynamicContent({ params }: PageProps<"/notes/[id]">) {
  const { id: noteId } = use(params);

  return (
    <>
      <p>Hello {noteId}</p>
      <p>{noteId}</p>
    </>
  );
}

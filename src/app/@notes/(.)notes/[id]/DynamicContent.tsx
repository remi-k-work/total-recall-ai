"use client";

// next
import { useParams } from "next/navigation";

export default function DynamicContent() {
  const { id: noteId } = useParams<{ id: string }>();

  return (
    <>
      <p>Hello {noteId}</p>
      <p>{noteId}</p>
    </>
  );
}

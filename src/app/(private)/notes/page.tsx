// next
import Link from "next/link";

// drizzle and db access
import { getNotes } from "@/features/notes/db";

// services, features, and other libraries
import { getUserSessionData, makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";

// components
import NotePreview from "@/features/notes/components/NotePreview";

// types
import type { Metadata } from "next";

// constants
export const metadata: Metadata = {
  title: "Total Recall AI ► Notes",
};

export default async function Page() {
  // Make sure the current user is authenticated (the check runs on the server side)
  await makeSureUserIsAuthenticated();

  // Access the user session data from the server side
  const {
    user: { id: userId },
  } = (await getUserSessionData())!;

  // Retrieve all notes for a user, including only the essential fields, and shorten the content for preview purposes
  const allNotes = await getNotes(userId);

  return (
    <>
      <h1>Notes</h1>
      <p>Welcome back! Below are all your notes</p>
      <article className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {allNotes.map((note) => (
          <Link key={note.id} href={`/notes/${note.id}`}>
            <NotePreview note={note} />
          </Link>
        ))}
      </article>
    </>
  );
}

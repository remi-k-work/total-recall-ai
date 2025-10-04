// drizzle and db access
import { getNote } from "@/features/notes/db";

// services, features, and other libraries
import { getUserSessionData, makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";

// components
import NoteDetails from "@/features/notes/components/NoteDetails";

// types
import type { Metadata } from "next";

// constants
export const metadata: Metadata = {
  title: "Total Recall AI ► Note Details",
};

export default async function Page({ params: paramsPromise }: PageProps<"/notes/[id]">) {
  // Get the "id" path parameter
  const { id } = await paramsPromise;

  // Make sure the current user is authenticated (the check runs on the server side)
  await makeSureUserIsAuthenticated();

  // Access the user session data from the server side
  const {
    user: { id: userId },
  } = (await getUserSessionData())!;

  // Get a single note for a user
  const [note] = await getNote(id, userId);

  return (
    <>
      <h1>Note Details</h1>
      <p>Below are all your note details</p>
      <NoteDetails note={note} />
    </>
  );
}

// drizzle and db access
import { getMostRecentNotes } from "@/features/notes/db";

// services, features, and other libraries
import { getUserSessionData, makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";

// components
import ProfileInfo from "@/features/dashboard/components/ProfileInfo";
import VerifyEmail from "@/features/dashboard/components/VerifyEmail";
import NotesPreview from "@/features/notes/components/NotesPreview";

// types
import type { Metadata } from "next";

// constants
export const metadata: Metadata = {
  title: "Total Recall AI ► Dashboard",
};

export default async function Page() {
  // Make sure the current user is authenticated (the check runs on the server side)
  await makeSureUserIsAuthenticated();

  // Access the user session data from the server side
  const {
    user,
    user: { id: userId },
  } = (await getUserSessionData())!;

  // Retrieve the most recently updated notes for a user, with an optional limit
  const notes = await getMostRecentNotes(userId, 3);

  return (
    <>
      <h1>Dashboard</h1>
      <p>Welcome back! Below is your account overview</p>
      <article className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ProfileInfo user={user} />
        <VerifyEmail user={user} />
      </article>
      <h2>Your Most Recent Notes</h2>
      <NotesPreview notes={notes} />
    </>
  );
}

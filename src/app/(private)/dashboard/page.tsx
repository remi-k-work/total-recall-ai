// react
import { Suspense } from "react";

// drizzle and db access
import { getAvailNoteTags, getMostRecentNotes } from "@/features/notes/db";

// services, features, and other libraries
import { getUserSessionData, makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";

// components
import PageHeader from "@/components/PageHeader";
import SectionHeader from "@/components/SectionHeader";
import ProfileInfo from "@/features/dashboard/components/ProfileInfo";
import VerifyEmail from "@/features/dashboard/components/VerifyEmail";
import NotesPreview from "@/features/notes/components/NotesPreview";

// types
import type { Metadata } from "next";

// constants
export const metadata: Metadata = {
  title: "Total Recall AI ► Dashboard",
};

// Page remains the fast, static shell
export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContent />
    </Suspense>
  );
}

// This new async component contains the dynamic logic
async function PageContent() {
  // Make sure the current user is authenticated (the check runs on the server side)
  await makeSureUserIsAuthenticated();

  // Access the user session data from the server side
  const {
    user,
    user: { id: userId },
    session,
  } = (await getUserSessionData())!;

  // Retrieve the most recently updated notes for a user, with an optional limit, as well as their available note tags
  const [notes, availNoteTags] = await Promise.all([getMostRecentNotes(userId, 3), getAvailNoteTags(userId)]);

  return (
    <>
      <PageHeader title="Dashboard" description="Welcome back! Below is your account overview" />
      <article className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ProfileInfo user={user} session={session} />
        <VerifyEmail user={user} />
      </article>
      <SectionHeader title="Your most recent notes" />
      <NotesPreview notes={notes} availNoteTags={availNoteTags} />
    </>
  );
}

function PageSkeleton() {
  return (
    <>
      <PageHeader title="Dashboard" description="Welcome back! Below is your account overview" />
      <SectionHeader title="Your most recent notes" />
    </>
  );
}

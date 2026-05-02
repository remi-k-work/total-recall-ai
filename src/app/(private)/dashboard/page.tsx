// react
import { Suspense } from "react";

// drizzle and db access
import { NoteDB, NoteTagDB } from "@/features/notes/db";

// services, features, and other libraries
import { Effect } from "effect";
import { runPageMainOrNavigate } from "@/lib/helpersEffect";
import { Auth } from "@/features/auth/lib/auth";

// components
import PageHeader from "@/components/PageHeader";
import SectionHeader from "@/components/SectionHeader";
import ProfileInfo, { ProfileInfoSkeleton } from "@/features/dashboard/components/ProfileInfo";
import VerifyEmailForm, { VerifyEmailFormSkeleton } from "@/features/dashboard/components/VerifyEmailForm";
import NotesPreview from "@/features/notes/components/NotesPreview";

// types
import type { Metadata } from "next";

// constants
export const metadata: Metadata = {
  title: "Total Recall AI ► Dashboard",
};

const main = Effect.gen(function* () {
  // Access the user session data from the server side or fail with an unauthorized access error
  const auth = yield* Auth;
  const {
    user,
    user: { id: userId },
    session,
  } = yield* auth.getUserSessionData;

  const noteDB = yield* NoteDB;
  const noteTagDB = yield* NoteTagDB;

  // Retrieve the most recently updated notes for a user, with an optional limit as well as their available note tags
  const [notes, availNoteTags] = yield* Effect.all([noteDB.getMostRecentNotes(userId, 3), noteTagDB.getAvailNoteTags(userId)], { concurrency: 2 });

  return { user, session, notes, availNoteTags };
});

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
  // Execute the main effect for the page, map known errors to the subsequent navigation helpers, and return the payload
  const { user, session, notes, availNoteTags } = await runPageMainOrNavigate(main);

  return (
    <>
      <PageHeader title="Dashboard" description="Welcome back! Below is your account overview" />
      <article className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ProfileInfo user={user} session={session} />
        <VerifyEmailForm user={user} />
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
      <article className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ProfileInfoSkeleton />
        <VerifyEmailFormSkeleton />
      </article>
      <SectionHeader title="Your most recent notes" />
    </>
  );
}

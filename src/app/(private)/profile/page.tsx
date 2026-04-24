// react
import { Suspense } from "react";

// services, features, and other libraries
import { Effect } from "effect";
import { runPageMainOrNavigate } from "@/lib/helpersEffect";
import { Auth } from "@/features/auth/lib/auth";

// components
import PageHeader from "@/components/PageHeader";
import ProfileDetailsForm from "@/features/profile/components/ProfileDetailsForm";
import EmailChangeForm from "@/features/profile/components/EmailChangeForm";
import PassChangeForm from "@/features/profile/components/PassChangeForm";
import PassSetupForm from "@/features/profile/components/PassSetupForm";
import SignOutEverywhere from "@/features/profile/components/SignOutEverywhere";

// types
import type { Metadata } from "next";

// constants
export const metadata: Metadata = {
  title: "Total Recall AI ► Profile",
};

const main = Effect.gen(function* () {
  // Access the user session data from the server side or fail with an unauthorized access error
  const auth = yield* Auth;
  const { user, session } = yield* auth.getUserSessionData;

  // Determine whether the current user has any "credential" type accounts
  const hasCredential = yield* auth.hasCredentialAccount;

  return { user, session, hasCredential };
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
  const { user, session, hasCredential } = await runPageMainOrNavigate(main);

  return (
    <>
      <PageHeader title="Profile" description="Below you can see and manage your profile" />
      <article className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ProfileDetailsForm user={user} session={session} />
        <EmailChangeForm user={user} />
        {hasCredential ? <PassChangeForm /> : <PassSetupForm />}
        <SignOutEverywhere />
      </article>
    </>
  );
}

function PageSkeleton() {
  return (
    <>
      <PageHeader title="Profile" description="Below you can see and manage your profile" />
    </>
  );
}

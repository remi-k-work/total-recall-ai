// react
import { Suspense } from "react";

// services, features, and other libraries
import { getUserSessionData, hasCredentialAccount, makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";

// components
import PageHeader from "@/components/PageHeader";
import ProfileDetailsForm from "@/features/profile/components/ProfileDetailsForm";
import EmailChangeForm from "@/features/profile/components/EmailChangeForm";
import PassChangeForm from "@/features/profile/components/PassChangeForm";
import SignOutEverywhere from "@/features/profile/components/SignOutEverywhere";

// types
import type { Metadata } from "next";

// constants
export const metadata: Metadata = {
  title: "Total Recall AI ► Profile",
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
  const { user, session } = (await getUserSessionData())!;

  // Determine whether the current user has any "credential" type accounts
  const hasCredential = await hasCredentialAccount();

  return (
    <>
      <PageHeader title="Profile" description="Below you can see and manage your profile" />
      <article className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ProfileDetailsForm user={user} session={session} />
        <EmailChangeForm user={user} />
        <PassChangeForm key={hasCredential ? "[PASSWORD CHANGE]" : "[PASSWORD SETUP]"} hasCredential={hasCredential} />
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

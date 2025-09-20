// services, features, and other libraries
import { getUserSessionData, makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";

// components
import EmailChangeForm from "@/features/profile/components/EmailChangeForm";

// types
import type { Metadata } from "next";

// constants
export const metadata: Metadata = {
  title: "Total Recall AI ► Profile",
};

export default async function Page() {
  // Make sure the current user is authenticated (the check runs on the server side)
  await makeSureUserIsAuthenticated();

  // Access the user session data from the server side
  const {
    user: { email },
  } = (await getUserSessionData())!;

  return (
    <>
      <h1>Profile</h1>
      <p>Below you can see and manage your profile</p>
      <EmailChangeForm currentEmail={email} />
    </>
  );
}

// services, features, and other libraries
import { getUserSessionData, makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";

// components
import ProfileInfo from "@/features/dashboard/components/ProfileInfo";

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
  const { user } = (await getUserSessionData())!;

  return (
    <>
      <h1>Dashboard</h1>
      <p>Welcome back! Below is your account overview</p>
      <ProfileInfo user={user} />
    </>
  );
}

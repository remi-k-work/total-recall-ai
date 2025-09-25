// services, features, and other libraries
import { getUserSessionData, makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";

// components
import ProfileDetailsForm from "@/features/profile/components/ProfileDetailsForm";
import EmailChangeForm from "@/features/profile/components/EmailChangeForm";
import PassChangeForm from "@/features/profile/components/PassChangeForm";

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
    user: { name, email, image },
  } = (await getUserSessionData())!;

  return (
    <>
      <h1>Profile</h1>
      <p>Below you can see and manage your profile</p>
      <ProfileDetailsForm currentName={name} currentImage={image ?? undefined} />
      <EmailChangeForm currentEmail={email} />
      <PassChangeForm />
    </>
  );
}

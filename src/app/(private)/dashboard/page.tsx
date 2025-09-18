// services, features, and other libraries
import { makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";

// types
import type { Metadata } from "next";

// constants
export const metadata: Metadata = {
  title: "Total Recall AI ► Dashboard",
};

export default async function Page() {
  // Make sure the current user is authenticated (the check runs on the server side)
  await makeSureUserIsAuthenticated();

  return (
    <>
      <p>Welcome to the Dashboard!</p>
    </>
  );
}

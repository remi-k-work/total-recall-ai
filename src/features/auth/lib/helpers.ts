// react
import { cache } from "react";

// next
import { headers } from "next/headers";
import { unauthorized } from "next/navigation";

// services
import { auth } from "@/services/better-auth/auth";

// Access the user session data from the server side
export const getUserSessionData = cache(async () => await auth.api.getSession({ headers: await headers() }));

// Make sure the current user is authenticated (the check runs on the server side)
export async function makeSureUserIsAuthenticated() {
  if (!(await getUserSessionData())) unauthorized();
}

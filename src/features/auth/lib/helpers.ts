// next
import { headers } from "next/headers";
import { unauthorized } from "next/navigation";
import { cacheLife } from "next/cache";

// services, features, and other libraries
import { auth } from "@/services/better-auth/auth";

// Access the user session data from the server side
// export const getUserSessionData = cache(async () => await auth.api.getSession({ headers: await headers() }));
export const getUserSessionData = async () => {
  "use cache: private";
  cacheLife({ stale: 60 });

  return auth.api.getSession({ headers: await headers() });
};

// Make sure the current user is authenticated (the check runs on the server side)
export async function makeSureUserIsAuthenticated() {
  if (!(await getUserSessionData())) unauthorized();
}

// Only check if the current user is authenticated (the check runs on the server side)
export const isUserAuthenticated = async () => !!(await getUserSessionData());

// List all accounts associated with the current user
// export const listUserAccounts = cache(async () => await auth.api.listUserAccounts({ headers: await headers() }));
export const listUserAccounts = async () => {
  "use cache: private";
  cacheLife({ stale: 60 });

  return auth.api.listUserAccounts({ headers: await headers() });
};

// Determine whether the current user has any "credential" type accounts
export const hasCredentialAccount = async () => (await listUserAccounts()).some((account) => account.providerId === "credential");

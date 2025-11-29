// react
import { cache } from "react";

// next
import { cookies, headers } from "next/headers";
import { unauthorized } from "next/navigation";

// services, features, and other libraries
import { auth } from "@/services/better-auth/auth";

// Access the user session data from the server side
export const getUserSessionData = cache(async () => await auth.api.getSession({ headers: await headers() }));

export const getServerSession = async (): Promise<ReturnType<typeof getUserSessionData> | null> => {
  const cookieHeader = (await cookies()).toString();
  const res = await fetch(`${process.env.BETTER_AUTH_URL}/api/auth/get-session`, { headers: { Cookie: cookieHeader }, credentials: "include" });
  if (!res.ok) return null;
  return await res.json();
};

// Make sure the current user is authenticated (the check runs on the server side)
export async function makeSureUserIsAuthenticated() {
  if (!(await getUserSessionData())) unauthorized();
}

// Only check if the current user is authenticated (the check runs on the server side)
export const isUserAuthenticated = async () => !!(await getUserSessionData());

// List all accounts associated with the current user
export const listUserAccounts = cache(async () => await auth.api.listUserAccounts({ headers: await headers() }));

// Determine whether the current user has any "credential" type accounts
export const hasCredentialAccount = async () => (await listUserAccounts()).some((account) => account.providerId === "credential");

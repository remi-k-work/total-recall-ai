"use server";

// next
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// services, features, and other libraries
import { makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";
import { auth } from "@/services/better-auth/auth";
import { APIError } from "better-auth/api";

// types
export interface SignOutEverywhereActionResult {
  actionStatus: "idle" | "succeeded" | "failed" | "authError";
  actionError?: string;
}

// Signs the user out from all devices
export default async function signOutEverywhere(): Promise<SignOutEverywhereActionResult> {
  try {
    // Make sure the current user is authenticated (the check runs on the server side)
    await makeSureUserIsAuthenticated();

    // Sign the user out from all devices through the better-auth api
    await auth.api.revokeSessions({ headers: await headers() });
  } catch (error) {
    // The better-auth api request failed with an error
    if (error instanceof APIError) return { actionStatus: "authError", actionError: error.message };

    // Some other error occurred
    return { actionStatus: "failed" };
  }

  // Revalidate, so the fresh data will be fetched from the server next time this path is visited
  revalidatePath("/", "layout");

  // The form has successfully validated and submitted!
  return { actionStatus: "succeeded" };
}

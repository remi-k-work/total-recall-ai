"use server";

// next
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// services, features, and other libraries
import { getUserSessionData, makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";
import { auth } from "@/services/better-auth/auth";
import { APIError } from "better-auth/api";

// types
export interface VerifyEmailActionResult {
  actionStatus: "idle" | "succeeded" | "failed" | "authError";
  actionError?: string;
}

// Triggers the email verification process for the current user
export default async function verifyEmail(): Promise<VerifyEmailActionResult> {
  try {
    // Make sure the current user is authenticated (the check runs on the server side)
    await makeSureUserIsAuthenticated();

    // Access the user session data from the server side
    const {
      user: { email },
    } = (await getUserSessionData())!;

    // Trigger the email verification process manually for this user through the better-auth api
    await auth.api.sendVerificationEmail({ body: { email, callbackURL: "/email-verified" }, headers: await headers() });
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

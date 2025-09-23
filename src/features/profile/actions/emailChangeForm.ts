/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

// next
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// services, features, and other libraries
import { getUserSessionData, makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";
import { auth } from "@/services/better-auth/auth";
import { initialFormState, ServerValidateError } from "@tanstack/react-form/nextjs";
import { SERVER_VALIDATE } from "@/features/profile/constants/emailChangeForm";
import { APIError } from "better-auth/api";

// types
import type { ServerFormState } from "@tanstack/react-form/nextjs";

export interface EmailChangeFormActionResult extends ServerFormState<any, any> {
  actionStatus: "idle" | "succeeded" | "failed" | "invalid" | "authError";
  actionError?: string;
  needsApproval?: boolean;
}

// The main server action that processes the form
export default async function emailChange(_prevState: unknown, formData: FormData): Promise<EmailChangeFormActionResult> {
  // Whether or not the user needs to approve their email change
  let needsApproval = false;

  try {
    // Make sure the current user is authenticated (the check runs on the server side)
    await makeSureUserIsAuthenticated();

    // Access the user session data from the server side
    const {
      user: { emailVerified },
    } = (await getUserSessionData())!;

    // Only users with verified emails need to additionally approve their email change
    if (emailVerified) needsApproval = true;

    // Validate the form on the server side and extract needed data
    const { newEmail } = await SERVER_VALIDATE(formData);

    // Request the email change through the better-auth api for the user
    await auth.api.changeEmail({ body: { newEmail, callbackURL: needsApproval ? "/email-approved" : "/email-verified" }, headers: await headers() });
  } catch (error) {
    // Validation has failed
    if (error instanceof ServerValidateError) return { ...error.formState, actionStatus: "invalid" };

    // The better-auth api request failed with an error
    if (error instanceof APIError) return { ...initialFormState, actionStatus: "authError", actionError: error.message };

    // Some other error occurred
    return { ...initialFormState, actionStatus: "failed" };
  }

  // Revalidate, so the fresh data will be fetched from the server next time this path is visited
  revalidatePath("/", "layout");

  // The form has successfully validated and submitted!
  return { ...initialFormState, actionStatus: "succeeded", needsApproval };
}

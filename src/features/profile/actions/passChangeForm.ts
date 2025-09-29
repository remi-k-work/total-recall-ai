/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

// next
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// services, features, and other libraries
import { makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";
import { auth } from "@/services/better-auth/auth";
import { initialFormState, ServerValidateError } from "@tanstack/react-form/nextjs";
import { SERVER_VALIDATE_CHANGE, SERVER_VALIDATE_SETUP } from "@/features/profile/constants/passChangeForm";
import { APIError } from "better-auth/api";

// types
import type { ServerFormState } from "@tanstack/react-form/nextjs";

export interface PassChangeFormActionResult extends ServerFormState<any, any> {
  actionStatus: "idle" | "succeeded" | "failed" | "invalid" | "authError";
  actionError?: string;
}

// The main server action that processes the form
export default async function passChange(hasCredential: boolean, _prevState: unknown, formData: FormData): Promise<PassChangeFormActionResult> {
  try {
    // Make sure the current user is authenticated (the check runs on the server side)
    await makeSureUserIsAuthenticated();

    // Validate the form on the server side and extract needed data
    let currentPassword: string, newPassword: string;
    if (hasCredential) ({ currentPassword, newPassword } = await SERVER_VALIDATE_CHANGE(formData));
    else ({ newPassword } = await SERVER_VALIDATE_SETUP(formData));

    // Change or setup the password through the better-auth api for the user
    if (hasCredential) await auth.api.changePassword({ body: { currentPassword: currentPassword!, newPassword }, headers: await headers() });
    else await auth.api.setPassword({ body: { newPassword }, headers: await headers() });
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
  return { ...initialFormState, actionStatus: "succeeded" };
}

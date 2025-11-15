/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

// next
import { revalidatePath } from "next/cache";

// services, features, and other libraries
import { auth } from "@/services/better-auth/auth";
import { initialFormState, ServerValidateError } from "@tanstack/react-form-nextjs";
import { SERVER_VALIDATE } from "@/features/auth/constants/resetPassForm";
import { APIError } from "better-auth/api";

// types
import type { ServerFormState } from "@tanstack/react-form-nextjs";

export interface ResetPassFormActionResult extends ServerFormState<any, any> {
  actionStatus: "idle" | "succeeded" | "failed" | "invalid" | "authError";
  actionError?: string;
}

// The main server action that processes the form
export default async function resetPass(token: string, _prevState: unknown, formData: FormData): Promise<ResetPassFormActionResult> {
  try {
    // Validate the form on the server side and extract needed data
    const { newPassword } = await SERVER_VALIDATE(formData);

    // Reset the password through the better-auth api for the user
    await auth.api.resetPassword({ body: { newPassword, token } });
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

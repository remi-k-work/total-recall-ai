/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

// next
import { revalidatePath } from "next/cache";

// services
import { auth } from "@/services/better-auth/auth";

// other libraries
import { initialFormState, ServerValidateError } from "@tanstack/react-form/nextjs";
import { SERVER_VALIDATE } from "@/features/auth/constants/signUpForm";
import { APIError } from "better-auth/api";

// types
import type { ServerFormState } from "@tanstack/react-form/nextjs";

export interface SignUpFormActionResult extends ServerFormState<any, any> {
  actionStatus: "idle" | "succeeded" | "failed" | "invalid" | "authError";
  actionError?: string;
}

export default async function signUp(_prevState: unknown, formData: FormData): Promise<SignUpFormActionResult> {
  try {
    // Validate the form and sign a user up
    const { name, email, password } = await SERVER_VALIDATE(formData);
    await auth.api.signUpEmail({ body: { name, email, password } });
  } catch (error) {
    // Validation has failed
    if (error instanceof ServerValidateError) return { ...error.formState, actionStatus: "invalid" };

    // The better-auth api request failed with an error
    if (error instanceof APIError) return { ...initialFormState, actionStatus: "authError", actionError: error.message };

    // Some other error occurred
    return { ...initialFormState, actionStatus: "failed" };
  }

  // Revalidate, so the fresh data will be fetched from the server next time this path is visited
  revalidatePath("/sign-up");

  // The form has successfully validated and submitted!
  return { ...initialFormState, actionStatus: "succeeded" };
}

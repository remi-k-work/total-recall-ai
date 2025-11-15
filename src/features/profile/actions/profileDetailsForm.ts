/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

// next
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// services, features, and other libraries
import { getUserSessionData, makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";
import { auth } from "@/services/better-auth/auth";
import { initialFormState, ServerValidateError } from "@tanstack/react-form-nextjs";
import { SERVER_VALIDATE } from "@/features/profile/constants/profileDetailsForm";
import { APIError } from "better-auth/api";

// types
import type { ServerFormState } from "@tanstack/react-form-nextjs";

export interface ProfileDetailsFormActionResult extends ServerFormState<any, any> {
  actionStatus: "idle" | "succeeded" | "failed" | "invalid" | "authError" | "demoMode";
  actionError?: string;
}

// The main server action that processes the form
export default async function profileDetails(_prevState: unknown, formData: FormData): Promise<ProfileDetailsFormActionResult> {
  try {
    // Make sure the current user is authenticated (the check runs on the server side)
    await makeSureUserIsAuthenticated();

    // Access the user session data from the server side
    const {
      user: { role },
    } = (await getUserSessionData())!;

    // Return early if the current user is in demo mode
    if (role === "demo") return { ...initialFormState, actionStatus: "demoMode" };

    // Validate the form on the server side and extract needed data
    const { name } = await SERVER_VALIDATE(formData);

    // Update the user information through the better-auth api by setting their name
    await auth.api.updateUser({ body: { name }, headers: await headers() });
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

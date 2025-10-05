/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

// next
import { revalidatePath } from "next/cache";

// services, features, and other libraries
import { makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";
import { initialFormState, ServerValidateError } from "@tanstack/react-form/nextjs";
import { SERVER_VALIDATE } from "@/features/notes/constants/newNoteForm";

// types
import type { ServerFormState } from "@tanstack/react-form/nextjs";

export interface NewNoteFormActionResult extends ServerFormState<any, any> {
  actionStatus: "idle" | "succeeded" | "failed" | "invalid";
}

// The main server action that processes the form
export default async function newNote(_prevState: unknown, formData: FormData): Promise<NewNoteFormActionResult> {
  try {
    // Make sure the current user is authenticated (the check runs on the server side)
    await makeSureUserIsAuthenticated();

    // Validate the form on the server side and extract needed data
    const { title, content } = await SERVER_VALIDATE(formData);
  } catch (error) {
    // Validation has failed
    if (error instanceof ServerValidateError) return { ...error.formState, actionStatus: "invalid" };

    // Some other error occurred
    return { ...initialFormState, actionStatus: "failed" };
  }

  // Revalidate, so the fresh data will be fetched from the server next time this path is visited
  revalidatePath("/", "layout");

  // The form has successfully validated and submitted!
  return { ...initialFormState, actionStatus: "succeeded" };
}

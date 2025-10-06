/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

// next
import { revalidatePath } from "next/cache";

// drizzle and db access
import { db } from "@/drizzle/db";
import { insertNote, insertNoteChunks } from "@/features/notes/db";

// services, features, and other libraries
import { getUserSessionData, makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";
import { initialFormState, ServerValidateError } from "@tanstack/react-form/nextjs";
import { SERVER_VALIDATE } from "@/features/notes/constants/newNoteForm";
import { generateNoteEmbeddings } from "@/features/notes/lib/embeddings";

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

    // Access the user session data from the server side
    const {
      user: { id: userId },
    } = (await getUserSessionData())!;

    // Validate the form on the server side and extract needed data
    const { title, content } = await SERVER_VALIDATE(formData);

    // Generate embeddings for a note first; it is an external api call that may throw and is time-consuming (no db lock held)
    const noteEmbeddings = await generateNoteEmbeddings(content);

    // Run all db operations in a transaction
    await db.transaction(async (tx) => {
      // Insert a new note for a user
      const [{ id: noteId }] = await insertNote(userId, { title, content }, tx);

      // Insert multiple new note chunks for a note and the current user
      await insertNoteChunks(userId, noteId, noteEmbeddings, tx);
    });
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

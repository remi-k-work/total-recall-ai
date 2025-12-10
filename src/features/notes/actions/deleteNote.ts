"use server";

// drizzle and db access
import { deleteNote as dbDeleteNote } from "@/features/notes/db";

// services, features, and other libraries
import { getUserSessionData, makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";

// types
export interface DeleteNoteActionResult {
  actionStatus: "idle" | "succeeded" | "failed" | "demoMode";
}

// This action deletes a user's note along with all associated note chunks
export default async function deleteNote(noteId: string): Promise<DeleteNoteActionResult> {
  try {
    // Make sure the current user is authenticated (the check runs on the server side)
    await makeSureUserIsAuthenticated();

    // Access the user session data from the server side
    const {
      user: { id: userId, role },
    } = (await getUserSessionData())!;

    // Return early if the current user is in demo mode
    if (role === "demo") return { actionStatus: "demoMode" };

    // Delete a note for a user
    await dbDeleteNote(noteId, userId);
  } catch {
    // Some other error occurred
    return { actionStatus: "failed" };
  }

  // The form has successfully validated and submitted!
  return { actionStatus: "succeeded" };
}

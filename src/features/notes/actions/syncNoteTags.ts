"use server";

// next
import { revalidatePath } from "next/cache";

// drizzle and db access
import { syncNoteTags as dbSyncNoteTags } from "@/features/notes/db";

// services, features, and other libraries
import { makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";

// types
export interface SyncNoteTagsActionResult {
  actionStatus: "idle" | "succeeded" | "failed";
}

// This action syncs the tags for a note (useful when the UI sends a full list of tags)
export default async function syncNoteTags(noteId: string, noteTagIds: string[]): Promise<SyncNoteTagsActionResult> {
  try {
    // Make sure the current user is authenticated (the check runs on the server side)
    await makeSureUserIsAuthenticated();

    // Sync tags for a note (useful when the UI sends a full list of tags)
    await dbSyncNoteTags(noteId, noteTagIds);
  } catch {
    // Some other error occurred
    return { actionStatus: "failed" };
  }

  // Revalidate, so the fresh data will be fetched from the server next time this path is visited
  revalidatePath("/notes");

  // The form has successfully validated and submitted!
  return { actionStatus: "succeeded" };
}

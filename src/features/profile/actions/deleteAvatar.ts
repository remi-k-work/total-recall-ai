"use server";

// next
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// drizzle and db access
import { deleteAvatar as deleteUserAvatar, getAvatarFileKey } from "@/features/profile/db";

// services, features, and other libraries
import { getUserSessionData, makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";
import { auth } from "@/services/better-auth/auth";
import { APIError } from "better-auth/api";
import { utApi } from "@/services/uploadthing/utApi";

// types
export interface DeleteAvatarActionResult {
  actionStatus: "idle" | "succeeded" | "failed" | "authError";
  actionError?: string;
}

export default async function deleteAvatar(): Promise<DeleteAvatarActionResult> {
  // Make sure the current user is authenticated (the check runs on the server side)
  await makeSureUserIsAuthenticated();

  // Access the user session data from the server side
  const {
    user: { id: userId },
  } = (await getUserSessionData())!;

  try {
    await auth.api.updateUser({ body: { image: null as unknown as undefined }, headers: await headers() });

    // Obtain the avatar file key for a user, which is unique to their avatar file in uploadthing
    const avatarFileKey = await getAvatarFileKey(userId);

    // Delete the old avatar file from uploadthing
    if (avatarFileKey) await utApi.deleteFiles(avatarFileKey);

    // Delete an avatar for a user
    await deleteUserAvatar(userId);
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

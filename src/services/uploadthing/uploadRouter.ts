// drizzle and db access
import { getAvatarFileKey, upsertAvatar } from "@/features/profile/db";

// services, features, and other libraries
import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getUserSessionData } from "@/features/auth/lib/helpers";
import { utApi } from "./utApi";

// types
import type { FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const uploadRouter = {
  avatarUploader: f({ image: { maxFileSize: "512KB", maxFileCount: 1 } }, { awaitServerData: true })
    .middleware(async () => {
      // Access the user session data from the server side
      const userSessionData = await getUserSessionData();
      if (!userSessionData) throw new UploadThingError("Unauthorized!");
      return { userId: userSessionData.user.id };
    })
    .onUploadComplete(async ({ metadata: { userId }, file: { key, ufsUrl } }) => {
      // Obtain the avatar file key for a user, which is unique to their avatar file in uploadthing
      const avatarFileKey = await getAvatarFileKey(userId);

      // Upsert an avatar for a user
      await upsertAvatar(userId, { fileKey: key, fileUrl: ufsUrl });

      // Delete the old avatar file from uploadthing
      if (avatarFileKey) await utApi.deleteFiles(avatarFileKey);

      return { message: "Avatar uploaded successfully." };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;

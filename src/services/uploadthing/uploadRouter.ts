// drizzle and db access
import { AvatarDB } from "@/features/profile/db";

// services, features, and other libraries
import { Effect } from "effect";
import { runComponentMain } from "@/lib/helpersEffect";
import { Auth } from "@/features/auth/lib/auth";
import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

// types
import type { FileRouter } from "uploadthing/next";

const middleware = Effect.gen(function* () {
  // Access the user session data from the server side or fail with an unauthorized access error
  const auth = yield* Auth;
  const {
    user: { id: userId },
  } = yield* auth.getUserSessionData;

  // Assert that the current user has at least one of the allowed roles
  yield* auth.assertRoles(["user", "admin"]);

  return userId;
}).pipe(Effect.orElse(() => Effect.fail(new UploadThingError("This action is disabled in demo mode."))));

const onUploadComplete = (userId: string, key: string, ufsUrl: string) =>
  Effect.gen(function* () {
    // Obtain the avatar file key for a user, which is unique to their avatar file in uploadthing
    const avatarDB = yield* AvatarDB;
    const avatarFileKey = yield* avatarDB.getAvatarFileKey(userId);

    // Upsert an avatar for a user
    yield* avatarDB.upsertAvatar(userId, { fileKey: key, fileUrl: ufsUrl });

    // Delete the old avatar file from uploadthing
    if (avatarFileKey) yield* avatarDB.deleteOldAvatar(avatarFileKey.fileKey);
  });

const f = createUploadthing();

export const uploadRouter = {
  avatarUploader: f({ image: { maxFileSize: "512KB", maxFileCount: 1 } }, { awaitServerData: true })
    .middleware(async () => {
      // Execute the main effect for the component, handle known errors, and return the payload
      const userId = await runComponentMain(middleware);

      return { userId };
    })
    .onUploadComplete(async ({ metadata: { userId }, file: { key, ufsUrl } }) => {
      // Execute the main effect for the component, handle known errors, and return the payload
      await runComponentMain(onUploadComplete(userId, key, ufsUrl));

      return { message: "Avatar uploaded successfully." };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;

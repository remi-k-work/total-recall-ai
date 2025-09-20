// services, features, and other libraries
import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getUserSessionData } from "@/features/auth/lib/helpers";

// types
import type { FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const uploadRouter = {
  avatarUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } }, { awaitServerData: true })
    .middleware(async () => {
      // Access the user session data from the server side
      const userSessionData = await getUserSessionData();
      if (!userSessionData) throw new UploadThingError("Unauthorized!");
      return { userId: userSessionData.user.id };
    })
    .onUploadComplete(({ metadata: { userId }, file: { ufsUrl, key } }) => {
      console.log("Upload complete for userId:", userId);
      console.log("file url", ufsUrl);

      return { message: "Avatar uploaded successfully." };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;

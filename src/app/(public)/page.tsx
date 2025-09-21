"use client";

// services, features, and other libraries
import { authClient } from "@/services/better-auth/auth-client";

// components
import { UploadButton } from "@/services/uploadthing/components";

export default function Page() {
  return (
    <>
      <p>Welcome to Total Recall AI!</p>
      <UploadButton
        endpoint="avatarUploader"
        onClientUploadComplete={async (res) => {
          console.log(res.at(0)?.serverData.message);

          // Update a user's image that should point to their avatar's url
          await authClient.updateUser({ image: res.at(0)?.ufsUrl });
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
    </>
  );
}

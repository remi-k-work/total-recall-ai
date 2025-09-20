"use client";

// components
import { UploadButton } from "@/services/uploadthing/components";

export default function Page() {
  return (
    <>
      <p>Welcome to Total Recall AI!</p>
      <UploadButton
        endpoint="avatarUploader"
        onClientUploadComplete={(res) => {
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
    </>
  );
}

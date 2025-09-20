// services, features, and other libraries
import { generateUploadButton, generateUploadDropzone } from "@uploadthing/react";

// types
import type { UploadRouter } from "@/services/uploadthing/uploadRouter";

export const UploadButton = generateUploadButton<UploadRouter>();
export const UploadDropzone = generateUploadDropzone<UploadRouter>();

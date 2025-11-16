"use server";

// node.js
import { join } from "path";
import { mkdir, writeFile } from "fs/promises";

// services, features, and other libraries
import { z } from "zod";
import { makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";
import { TranscriptionSchema } from "@/features/notes/schemas/transcription";

// types
import type { ProcessRecordingAction } from "@/components/AudioRecorder";

// This action transcribes a user's note from the provided audio file of the recorded note
const transcribeNote: ProcessRecordingAction<z.infer<typeof TranscriptionSchema>> = async (formData, recordingFieldName) => {
  try {
    // Make sure the current user is authenticated (the check runs on the server side)
    await makeSureUserIsAuthenticated();

    // Get access to the recording audio file and validate it
    const recordingAudioFile = formData.get(recordingFieldName);
    if (!recordingAudioFile || !(recordingAudioFile instanceof File)) throw new Error("Invalid recording audio file!");

    // Create a unique identifier for the recording audio file
    const recordingId = `note-recording-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Normally, we would upload the audio file to the server's storage
    const bytes = await recordingAudioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create the "uploads" directory in case it does not exist yet
    const uploadsDir = join(process.cwd(), "uploads");
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch {}

    // Save the recording audio file to the "uploads" directory
    const fileName = `${recordingId}.webm`;
    const filePath = join(uploadsDir, fileName);
    await writeFile(filePath, buffer);
  } catch (error) {
    // Some other error occurred
    console.error(error);
    return { actionStatus: "failed", result: null };
  }

  // The form has successfully validated and submitted!
  return { actionStatus: "succeeded", result: null };
};

export default transcribeNote;

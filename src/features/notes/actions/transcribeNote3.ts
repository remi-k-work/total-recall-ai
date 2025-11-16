"use server";

// services, features, and other libraries
import { z } from "zod";
import { makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { TranscriptionSchema } from "@/features/notes/schemas/transcription";

// types
import type { ProcessRecordingAction } from "@/components/AudioRecorder";

// constants
import { TRANSCRIBE_SYSTEM_MESSAGE, USER_INSTRUCTION_EXISTING_NOTE, USER_INSTRUCTION_NEW_NOTE } from "@/features/notes/constants/messages";

// This action transcribes a user's note from the provided audio file of the recorded note
const transcribeNote: ProcessRecordingAction<z.infer<typeof TranscriptionSchema>> = async (formData, recordingFieldName, otherFields) => {
  let object: z.infer<typeof TranscriptionSchema>;

  try {
    // Make sure the current user is authenticated (the check runs on the server side)
    await makeSureUserIsAuthenticated();

    // Get access to the recording audio file and validate it
    const recordingAudioFile = formData.get(recordingFieldName);
    if (!recordingAudioFile || !(recordingAudioFile instanceof File)) throw new Error("Invalid recording audio file!");

    ({ object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: TranscriptionSchema,
      system: TRANSCRIBE_SYSTEM_MESSAGE,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "file",
              mediaType: "audio/webm",
              data: await recordingAudioFile.arrayBuffer(),
            },
            {
              type: "text",
              text: otherFields?.isNewNote ? USER_INSTRUCTION_NEW_NOTE : USER_INSTRUCTION_EXISTING_NOTE,
            },
          ],
        },
      ],
    }));
  } catch (error) {
    // Some other error occurred
    console.error(error);
    return { actionStatus: "failed", result: null };
  }

  // The form has successfully validated and submitted!
  return { actionStatus: "succeeded", result: object };
};

export default transcribeNote;

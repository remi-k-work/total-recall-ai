"use server";

// services, features, and other libraries
import { z } from "zod";
import { makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
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

    const { text: transcript } = await generateText({
      model: google("gemini-2.5-flash"),
      system:
        "You are an AI audio transcriber. Users will upload an audio file, and you should transcribe it, responding only with the text content of the audio file and nothing else. Users may also provide custom instructions, which you should take into account. If you hear no words, respond with 'No speech detected.'",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "file",
              mediaType: "audio/webm",
              data: await recordingAudioFile.arrayBuffer(),
            },
          ],
        },
      ],
    });

    console.log("transcript", transcript);
  } catch (error) {
    // Some other error occurred
    console.error(error);
    return { actionStatus: "failed", result: null };
  }

  // The form has successfully validated and submitted!
  return { actionStatus: "succeeded", result: null };
};

export default transcribeNote;

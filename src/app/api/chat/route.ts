// services, features, and other libraries
import { getUserSessionData, makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";
import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages, stepCountIs, NoSuchToolError, InvalidToolInputError } from "ai";
import { searchNoteChunksForUserTool } from "@/features/notes-assistant/tools/searchNoteChunksForUser";

// types
import type { UIMessage } from "@ai-sdk/react";

// constants
import { SYSTEM_MESSAGE } from "@/features/notes-assistant/constants/messages";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  // Make sure the current user is authenticated (the check runs on the server side)
  await makeSureUserIsAuthenticated();

  // Access the user session data from the server side
  const {
    user: { id: userId },
  } = (await getUserSessionData())!;

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: SYSTEM_MESSAGE,
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),

    activeTools: ["searchNoteChunksForUser"],

    // Define available tools
    tools: { searchNoteChunksForUser: searchNoteChunksForUserTool(userId) },
    onError(error) {
      console.error("streamText error:", error);
    },
  });

  // Inspect the provider's warnings for any unsupported ai sdk features
  result.warnings.then((warnings) => console.warn("streamText warnings:", warnings));

  return result.toUIMessageStreamResponse({
    onError: (error) => {
      if (NoSuchToolError.isInstance(error)) {
        return "The model tried to call an unknown tool.";
      } else if (InvalidToolInputError.isInstance(error)) {
        return "The model called a tool with invalid inputs.";
      } else {
        return "An unknown error occurred.";
      }
    },
  });
}

// drizzle and db access
import { searchNoteChunksForUser } from "@/features/notes/db";

// services, features, and other libraries
import { getUserSessionData, makeSureUserIsAuthenticated } from "@/features/auth/lib/helpers";
import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages, stepCountIs, tool } from "ai";
import { z } from "zod";

// types
import type { UIMessage } from "@ai-sdk/react";

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
    system: `
      You are a helpful assistant that can search through the user's notes.
      Use the information from the notes to answer questions and provide insights.
      If the requested information is not available, respond with "Sorry, I can't find that information in your notes".
      You can use markdown formatting like links, bullet points, numbered lists, and bold text.
      Provide links to relevant notes using this relative URL structure (omit the base URL): '/notes/<noteId>'.
      Keep your responses concise and to the point.
    `,
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: {
      searchNoteChunksForUser: tool({
        description: "Search for and retrieve note chunks most relevant to the user's question",
        inputSchema: z.object({
          question: z.string().describe("The user's question"),
        }),
        execute: async ({ question }) => {
          console.log("searchNoteChunksForUser query:", question);

          // Search for and retrieve note chunks most relevant to the user's question
          const results = await searchNoteChunksForUser(userId, question);

          return {
            chunks: results.map((result) => ({
              content: result.chunk,
              source: `/notes/${result.noteId}`,
            })),
          };
        },
      }),
    },
    onError(error) {
      console.error("streamText error:", error);
    },
  });

  return result.toUIMessageStreamResponse();
}

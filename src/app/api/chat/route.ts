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
    system: `You are a professional and highly efficient Personal Knowledge Assistant, expertly designed to search through and synthesize information from the user's private notes.

**Core Directives:**
1.  **Tool Use:** ALWAYS use the "searchNoteChunksForUser" tool to find relevant information *before* attempting to answer any question about the user's notes.
2.  **Grounding:** Base your answer *strictly* on the note content retrieved by the tool. Do not introduce external knowledge or speculation.
3.  **Conciseness:** Keep your responses concise and focused on directly answering the user's query.

**Formatting and Constraints:**
* You may use standard Markdown formatting (bold, lists, etc.) to structure your answer.
* **Sources:** If multiple notes contribute to the answer, provide a list of relevant source links at the very end of your response under a separate "Sources:" heading.
* **Links:** Provide links to relevant notes using this relative URL structure (omit the base URL): "/notes/<noteId>". Make sure to render them as clickable links in your response.

**Failure Condition:**
* If the tool returns no relevant chunks, or if the retrieved information is insufficient to answer the question, your entire response must be: "Sorry, I can't find that information in your notes."`,
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),

    activeTools: ["searchNoteChunksForUser"],

    // Recommended for tool calls
    temperature: 0,

    // Define available tools
    tools: {
      searchNoteChunksForUser: tool({
        description: "Search for and retrieve note chunks most relevant to the user's question.",
        inputSchema: z.object({
          question: z.string().describe("The user's question."),
        }),
        outputSchema: z
          .object({
            results: z
              .array(
                z
                  .object({
                    noteId: z.string().describe("The unique identifier of the note the chunk originated from."),
                    chunk: z.string().describe("The relevant text content (chunk) retrieved from the note."),
                    similarity: z
                      .number()
                      .describe("The similarity score (e.g., cosine similarity) of this chunk to the user's question. Higher is more relevant."),
                  })
                  .describe("A single result object containing a relevant note chunk and its metadata."),
              )
              .describe("An array of note chunks retrieved by the search, ordered by relevance (highest similarity score first)."),
          })
          .describe("The comprehensive result set from searching the user's notes."),
        execute: async ({ question }) => {
          console.log("searchNoteChunksForUser query:", question);

          // Search for and retrieve note chunks most relevant to the user's question
          return { results: await searchNoteChunksForUser(userId, question) };
        },
      }),
    },
    onError(error) {
      console.error("streamText error:", error);
    },
  });

  return result.toUIMessageStreamResponse();
}

// drizzle and db access
import { searchNoteChunksForUser } from "@/features/notes/db";

// services, features, and other libraries
import { tool } from "ai";
import { InputSchema, OutputSchema } from "@/features/notes-assistant/schemas/searchNoteChunksForUser";

export const searchNoteChunksForUserTool = (userId: string) =>
  tool({
    description: "Search for and retrieve note chunks most relevant to the user's question.",
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
    execute: async ({ question }) => {
      console.log("searchNoteChunksForUser query:", question);

      // Search for and retrieve note chunks most relevant to the user's question
      return { results: await searchNoteChunksForUser(userId, question) };
    },
  });

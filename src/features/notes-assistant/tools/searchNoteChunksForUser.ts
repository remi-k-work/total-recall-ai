// drizzle and db access
import { searchNoteChunksForUser } from "@/features/notes/db";

// services, features, and other libraries
import { tool } from "ai";
import { InputSchema, OutputSchema } from "@/features/notes-assistant/schemas/searchNoteChunksForUser";
import { expandQueryWithHypotheticalAnswer } from "@/features/notes-assistant/lib/helpers";

export const searchNoteChunksForUserTool = (userId: string) =>
  tool({
    description:
      "Searches the user's personal notes to find chunks of text that are semantically relevant to their question. Must be used as the first step to answer any user query.",
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
    execute: async ({ question }) => {
      // Expand the user's question into a hypothetical answer
      const expandedQuery = await expandQueryWithHypotheticalAnswer(question);

      // Search for and retrieve note chunks most relevant to the user's question
      return { results: await searchNoteChunksForUser(userId, expandedQuery) };
    },
  });

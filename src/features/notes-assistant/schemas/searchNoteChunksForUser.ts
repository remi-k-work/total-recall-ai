// services, features, and other libraries
import { z } from "zod";

// schemas
export const InputSchema = z.object({ question: z.string().describe("The user's question.") });
export const OutputSchema = z
  .object({
    results: z
      .array(
        z
          .object({
            noteId: z.string().describe("The unique identifier of the note the chunk originated from."),
            chunk: z.string().describe("The relevant text content (chunk) retrieved from the note."),
            similarity: z.number().describe("The similarity score (e.g., cosine similarity) of this chunk to the user's question. Higher is more relevant."),
          })
          .describe("A single result object containing a relevant note chunk and its metadata."),
      )
      .describe("An array of note chunks retrieved by the search, ordered by relevance (highest similarity score first)."),
  })
  .describe("The comprehensive result set from searching the user's notes.");

// types
import type { ToolUIPart } from "ai";

export type SearchNoteChunksForUserToolUIPart = ToolUIPart<{
  searchNoteChunksForUser: { input: z.infer<typeof InputSchema>; output: z.infer<typeof OutputSchema> };
}>;

// services, features, and other libraries
import { z } from "zod";

// schemas
export const InputSchema = z.object({
  question: z.string().describe("The user's complete, original question. This is used to find the most relevant information within their notes."),
});
export const OutputSchema = z
  .object({
    results: z
      .array(
        z
          .object({
            noteId: z.string().describe("The unique ID of the source note."),
            noteTitle: z.string().describe("The title of the source note."),
            chunk: z.string().describe("The relevant snippet of text from the note."),
            similarity: z.number().describe("A score from 0.0 to 1.0 indicating how relevant the chunk is to the user's question. Higher is better."),
          })
          .describe("A single relevant chunk of text found in a note."),
      )
      .describe("An array of relevant note chunks found, ordered from most to least relevant."),
  })
  .describe("The search results containing chunks of text from the user's notes.");

// types
import type { ToolUIPart } from "ai";

export type SearchNoteChunksForUserToolUIPart = ToolUIPart<{
  searchNoteChunksForUser: { input: z.infer<typeof InputSchema>; output: z.infer<typeof OutputSchema> };
}>;

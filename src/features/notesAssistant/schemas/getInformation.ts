// services, features, and other libraries
import { z } from "zod";

const SimilaritySchema = z
  .number()
  .min(0)
  .max(1)
  .describe("A score from 0.0 to 1.0 indicating how relevant the chunk is to the user's question. Higher is better.");

export const InputSchema = z.object({
  question: z.string().trim().min(1).describe("The user's complete, original question. This is used to find the most relevant information within their notes."),
});

export const OutputSchema = z
  .array(
    z.object({
      noteId: z.uuid().describe("The unique ID of the source note."),
      noteTitle: z.string().trim().min(1).max(50).describe("The title of the source note."),
      chunk: z.string().trim().min(1).describe("The relevant snippet of text from the note."),
      similarity: SimilaritySchema,
    })
  )
  .describe("An array of relevant note chunks found, ordered from most to least relevant.");

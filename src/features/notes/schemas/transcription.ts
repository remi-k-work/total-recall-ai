// services, features, and other libraries
import { z } from "zod";

export const TranscriptionSchema = z.object({
  title: z
    .string()
    .nullable()
    .describe(
      "A concise, generated title for the note (e.g., 'Project Brainstorm'). This should ONLY be generated if the user instruction specifies this is a 'new note'. Otherwise, this field MUST be null.",
    ),
  content: z
    .string()
    .describe(
      "The fully transcribed text from the audio, formatted in rich Markdown based on the user's speech patterns (headings, lists, quotes, etc.). If no speech is detected, this should be 'No speech detected.'",
    ),
});

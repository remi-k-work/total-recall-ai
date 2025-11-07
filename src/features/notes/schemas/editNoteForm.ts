// services, features, and other libraries
import { z } from "zod";

export const EditNoteFormSchema = z.object({
  title: z.string().trim().min(1, "Please provide the note title; this is a necessary field").max(50, "Please keep the title to a maximum of 50 characters"),
  content: z
    .string()
    .trim()
    .min(1, "What do you want to write in your note? This is a mandatory field")
    .max(2048, "Please keep the content to a maximum of 2048 characters"),
  markdown: z.string().trim().optional(),
});

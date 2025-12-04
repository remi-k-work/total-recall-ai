// services, features, and other libraries
import { z } from "zod";

export const EditAvailNoteTagsFormSchema = z.array(
  z.object({
    name: z
      .string()
      .trim()
      .min(1, "Please provide the note tag name; this is a necessary field")
      .max(50, "Please keep the note tag name to a maximum of 50 characters"),
  }),
);

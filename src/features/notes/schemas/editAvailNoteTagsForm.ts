// services, features, and other libraries
import { z } from "zod";

export const EditAvailNoteTagsFormSchema = z
  .object({
    availNoteTags: z.array(
      z.object({
        name: z
          .string()
          .trim()
          .min(1, "Please provide the note tag name; this is a necessary field")
          .max(50, "Please keep the note tag name to a maximum of 50 characters"),
      }),
    ),
  })
  .refine(
    (data) => {
      // Extract all note tag names, and normalize them by trimming whitespace and converting to lowercase
      const allNoteTagNames = data.availNoteTags.map(({ name }) => name.trim().toLowerCase());

      // A Set automatically eliminates duplicate items; therefore, if the array contains duplicates, the Set will be smaller than the original array
      return new Set(allNoteTagNames).size === allNoteTagNames.length;
    },
    {
      message: "All note tag names must be unique!",
      path: ["availNoteTags"],
    },
  );

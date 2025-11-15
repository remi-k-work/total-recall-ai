// services, features, and other libraries
import { z } from "zod";
import { formOptions, initialFormState } from "@tanstack/react-form-nextjs";
import { EditNoteFormSchema } from "@/features/notes/schemas/editNoteForm";
import { createServerValidateWithTransforms } from "@/lib/helpers";

// types
import type { EditNoteFormActionResult } from "@/features/notes/actions/editNoteForm";

// constants
const DEFAULT_VALUES: z.input<typeof EditNoteFormSchema> = { title: "", content: "", markdown: "" };

export const FORM_OPTIONS = formOptions({ defaultValues: DEFAULT_VALUES });
export const INITIAL_FORM_STATE: EditNoteFormActionResult = { ...initialFormState, actionStatus: "idle" };
export const SERVER_VALIDATE = createServerValidateWithTransforms(DEFAULT_VALUES, EditNoteFormSchema);

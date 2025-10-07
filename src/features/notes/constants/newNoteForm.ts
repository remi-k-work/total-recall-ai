// services, features, and other libraries
import { z } from "zod";
import { formOptions, initialFormState } from "@tanstack/react-form/nextjs";
import { NewNoteFormSchema } from "@/features/notes/schemas/newNoteForm";
import { createServerValidateWithTransforms } from "@/lib/helpers";

// types
import type { NewNoteFormActionResult } from "@/features/notes/actions/newNoteForm";

// constants
const DEFAULT_VALUES: z.input<typeof NewNoteFormSchema> = { title: "", content: "" };

export const FORM_OPTIONS = formOptions({ defaultValues: DEFAULT_VALUES });
export const INITIAL_FORM_STATE: NewNoteFormActionResult = { ...initialFormState, actionStatus: "idle" };
export const SERVER_VALIDATE = createServerValidateWithTransforms(DEFAULT_VALUES, NewNoteFormSchema);

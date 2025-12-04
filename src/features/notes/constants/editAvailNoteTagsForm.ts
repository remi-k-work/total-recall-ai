// services, features, and other libraries
import { z } from "zod";
import { formOptions, initialFormState } from "@tanstack/react-form-nextjs";
import { EditAvailNoteTagsFormSchema } from "@/features/notes/schemas/editAvailNoteTagsForm";
import { createServerValidateWithTransforms } from "@/lib/helpers";

// types
import type { EditAvailNoteTagsFormActionResult } from "@/features/notes/actions/editAvailNoteTagsForm";

// constants
const DEFAULT_VALUES: z.input<typeof EditAvailNoteTagsFormSchema> = { availNoteTags: [{ name: "" }] };

export const FORM_OPTIONS = formOptions({ defaultValues: DEFAULT_VALUES });
export const INITIAL_FORM_STATE: EditAvailNoteTagsFormActionResult = { ...initialFormState, actionStatus: "idle" };
export const SERVER_VALIDATE = createServerValidateWithTransforms(DEFAULT_VALUES, EditAvailNoteTagsFormSchema);

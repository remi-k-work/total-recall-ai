// services, features, and other libraries
import { z } from "zod";
import { formOptions, initialFormState } from "@tanstack/react-form-nextjs";
import { EmailChangeFormSchema } from "@/features/profile/schemas/emailChangeForm";
import { createServerValidateWithTransforms } from "@/lib/helpers";

// types
import type { EmailChangeFormActionResult } from "@/features/profile/actions/emailChangeForm";

// constants
const DEFAULT_VALUES: z.input<typeof EmailChangeFormSchema> = { newEmail: "" };

export const FORM_OPTIONS = formOptions({ defaultValues: DEFAULT_VALUES });
export const INITIAL_FORM_STATE: EmailChangeFormActionResult = { ...initialFormState, actionStatus: "idle" };
export const SERVER_VALIDATE = createServerValidateWithTransforms(DEFAULT_VALUES, EmailChangeFormSchema);

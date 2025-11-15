// services, features, and other libraries
import { z } from "zod";
import { formOptions, initialFormState } from "@tanstack/react-form-nextjs";
import { ResetPassFormSchema } from "@/features/auth/schemas/resetPassForm";
import { createServerValidateWithTransforms } from "@/lib/helpers";

// types
import type { ResetPassFormActionResult } from "@/features/auth/actions/resetPassForm";

// constants
const DEFAULT_VALUES: z.input<typeof ResetPassFormSchema> = { newPassword: "", confirmPassword: "" };

export const FORM_OPTIONS = formOptions({ defaultValues: DEFAULT_VALUES });
export const INITIAL_FORM_STATE: ResetPassFormActionResult = { ...initialFormState, actionStatus: "idle" };
export const SERVER_VALIDATE = createServerValidateWithTransforms(DEFAULT_VALUES, ResetPassFormSchema);

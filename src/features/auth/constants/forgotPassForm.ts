// services, features, and other libraries
import { z } from "zod";
import { formOptions, initialFormState } from "@tanstack/react-form-nextjs";
import { ForgotPassFormSchema } from "@/features/auth/schemas/forgotPassForm";
import { createServerValidateWithTransforms } from "@/lib/helpers";

// types
import type { ForgotPassFormActionResult } from "@/features/auth/actions/forgotPassForm";

// constants
const DEFAULT_VALUES: z.input<typeof ForgotPassFormSchema> = { email: "" };

export const FORM_OPTIONS = formOptions({ defaultValues: DEFAULT_VALUES });
export const INITIAL_FORM_STATE: ForgotPassFormActionResult = { ...initialFormState, actionStatus: "idle" };
export const SERVER_VALIDATE = createServerValidateWithTransforms(DEFAULT_VALUES, ForgotPassFormSchema);

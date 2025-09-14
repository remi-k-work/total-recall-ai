// other libraries
import { z } from "zod";
import { createServerValidate, formOptions, initialFormState } from "@tanstack/react-form/nextjs";
import { ResetPassFormSchema } from "@/features/auth/schemas/resetPassForm";

// types
import type { ResetPassFormActionResult } from "@/features/auth/actions/resetPassForm";

// constants
const DEFAULT_VALUES: z.input<typeof ResetPassFormSchema> = { newPassword: "" };

export const FORM_OPTIONS = formOptions({ defaultValues: DEFAULT_VALUES });
export const INITIAL_FORM_STATE: ResetPassFormActionResult = { ...initialFormState, actionStatus: "idle" };
export const SERVER_VALIDATE = createServerValidate({ defaultValues: DEFAULT_VALUES, onServerValidate: ResetPassFormSchema });

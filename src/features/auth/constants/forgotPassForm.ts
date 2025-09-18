// services, features, and other libraries
import { z } from "zod";
import { createServerValidate, formOptions, initialFormState } from "@tanstack/react-form/nextjs";
import { ForgotPassFormSchema } from "@/features/auth/schemas/forgotPassForm";

// types
import type { ForgotPassFormActionResult } from "@/features/auth/actions/forgotPassForm";

// constants
const DEFAULT_VALUES: z.input<typeof ForgotPassFormSchema> = { email: "" };

export const FORM_OPTIONS = formOptions({ defaultValues: DEFAULT_VALUES });
export const INITIAL_FORM_STATE: ForgotPassFormActionResult = { ...initialFormState, actionStatus: "idle" };
export const SERVER_VALIDATE = createServerValidate({ defaultValues: DEFAULT_VALUES, onServerValidate: ForgotPassFormSchema });

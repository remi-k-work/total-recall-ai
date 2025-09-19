// services, features, and other libraries
import { z } from "zod";
import { createServerValidate, formOptions, initialFormState } from "@tanstack/react-form/nextjs";
import { EmailChangeFormSchema } from "@/features/profile/schemas/emailChangeForm";

// types
import type { EmailChangeFormActionResult } from "@/features/profile/actions/emailChangeForm";

// constants
const DEFAULT_VALUES: z.input<typeof EmailChangeFormSchema> = { newEmail: "" };

export const FORM_OPTIONS = formOptions({ defaultValues: DEFAULT_VALUES });
export const INITIAL_FORM_STATE: EmailChangeFormActionResult = { ...initialFormState, actionStatus: "idle" };
export const SERVER_VALIDATE = createServerValidate({ defaultValues: DEFAULT_VALUES, onServerValidate: EmailChangeFormSchema });

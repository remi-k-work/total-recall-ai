// services, features, and other libraries
import { z } from "zod";
import { createServerValidate, formOptions, initialFormState } from "@tanstack/react-form/nextjs";
import { PassChangeFormSchema } from "@/features/profile/schemas/passChangeForm";

// types
import type { PassChangeFormActionResult } from "@/features/profile/actions/passChangeForm";

// constants
const DEFAULT_VALUES: z.input<typeof PassChangeFormSchema> = { currentPassword: "", newPassword: "", confirmPassword: "" };

export const FORM_OPTIONS = formOptions({ defaultValues: DEFAULT_VALUES });
export const INITIAL_FORM_STATE: PassChangeFormActionResult = { ...initialFormState, actionStatus: "idle" };
export const SERVER_VALIDATE = createServerValidate({ defaultValues: DEFAULT_VALUES, onServerValidate: PassChangeFormSchema });

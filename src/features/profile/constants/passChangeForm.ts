// services, features, and other libraries
import { z } from "zod";
import { createServerValidate, formOptions, initialFormState } from "@tanstack/react-form/nextjs";
import { PassChangeFormSchema, PassSetupFormSchema } from "@/features/profile/schemas/passChangeForm";

// types
import type { PassChangeFormActionResult } from "@/features/profile/actions/passChangeForm";

// constants
const DEFAULT_VALUES_CHANGE: z.input<typeof PassChangeFormSchema> = { currentPassword: "", newPassword: "", confirmPassword: "" };
const DEFAULT_VALUES_SETUP: z.input<typeof PassSetupFormSchema> = { newPassword: "", confirmPassword: "" };

export const FORM_OPTIONS_CHANGE = formOptions({ defaultValues: DEFAULT_VALUES_CHANGE });
export const FORM_OPTIONS_SETUP = formOptions({ defaultValues: DEFAULT_VALUES_SETUP });
export const INITIAL_FORM_STATE: PassChangeFormActionResult = { ...initialFormState, actionStatus: "idle" };
export const SERVER_VALIDATE_CHANGE = createServerValidate({ defaultValues: DEFAULT_VALUES_CHANGE, onServerValidate: PassChangeFormSchema });
export const SERVER_VALIDATE_SETUP = createServerValidate({ defaultValues: DEFAULT_VALUES_SETUP, onServerValidate: PassSetupFormSchema });

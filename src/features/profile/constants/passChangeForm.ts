// services, features, and other libraries
import { z } from "zod";
import { formOptions, initialFormState } from "@tanstack/react-form/nextjs";
import { PassChangeFormSchema, PassSetupFormSchema } from "@/features/profile/schemas/passChangeForm";
import { createServerValidateWithTransforms } from "@/lib/helpers";

// types
import type { PassChangeFormActionResult } from "@/features/profile/actions/passChangeForm";

// constants
const DEFAULT_VALUES_CHANGE: z.input<typeof PassChangeFormSchema> = { currentPassword: "", newPassword: "", confirmPassword: "" };
const DEFAULT_VALUES_SETUP: z.input<typeof PassSetupFormSchema> = { newPassword: "", confirmPassword: "" };

export const FORM_OPTIONS_CHANGE = formOptions({ defaultValues: DEFAULT_VALUES_CHANGE });
export const FORM_OPTIONS_SETUP = formOptions({ defaultValues: DEFAULT_VALUES_SETUP });
export const INITIAL_FORM_STATE: PassChangeFormActionResult = { ...initialFormState, actionStatus: "idle" };
export const SERVER_VALIDATE_CHANGE = createServerValidateWithTransforms(DEFAULT_VALUES_CHANGE, PassChangeFormSchema);
export const SERVER_VALIDATE_SETUP = createServerValidateWithTransforms(DEFAULT_VALUES_SETUP, PassSetupFormSchema);

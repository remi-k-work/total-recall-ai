// services, features, and other libraries
import { z } from "zod";
import { createServerValidate, formOptions, initialFormState } from "@tanstack/react-form/nextjs";
import { ProfileDetailsFormSchema } from "@/features/profile/schemas/profileDetailsForm";

// types
import type { ProfileDetailsFormActionResult } from "@/features/profile/actions/profileDetailsForm";

// constants
const DEFAULT_VALUES: z.input<typeof ProfileDetailsFormSchema> = { name: "" };

export const FORM_OPTIONS = formOptions({ defaultValues: DEFAULT_VALUES });
export const INITIAL_FORM_STATE: ProfileDetailsFormActionResult = { ...initialFormState, actionStatus: "idle" };
export const SERVER_VALIDATE = createServerValidate({ defaultValues: DEFAULT_VALUES, onServerValidate: ProfileDetailsFormSchema });

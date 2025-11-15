// services, features, and other libraries
import { z } from "zod";
import { formOptions, initialFormState } from "@tanstack/react-form-nextjs";
import { SignUpFormSchema } from "@/features/auth/schemas/signUpForm";
import { createServerValidateWithTransforms } from "@/lib/helpers";

// types
import type { SignUpFormActionResult } from "@/features/auth/actions/signUpForm";

// constants
const DEFAULT_VALUES: z.input<typeof SignUpFormSchema> = { name: "", email: "", password: "", confirmPassword: "" };

export const FORM_OPTIONS = formOptions({ defaultValues: DEFAULT_VALUES });
export const INITIAL_FORM_STATE: SignUpFormActionResult = { ...initialFormState, actionStatus: "idle" };
export const SERVER_VALIDATE = createServerValidateWithTransforms(DEFAULT_VALUES, SignUpFormSchema);

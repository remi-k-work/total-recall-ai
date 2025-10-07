// services, features, and other libraries
import { z } from "zod";
import { formOptions, initialFormState } from "@tanstack/react-form/nextjs";
import { SignInFormSchema } from "@/features/auth/schemas/signInForm";
import { createServerValidateWithTransforms } from "@/lib/helpers";

// types
import type { SignInFormActionResult } from "@/features/auth/actions/signInForm";

// constants
const DEFAULT_VALUES: z.input<typeof SignInFormSchema> = { email: "", password: "", rememberMe: false };

export const FORM_OPTIONS = formOptions({ defaultValues: DEFAULT_VALUES });
export const INITIAL_FORM_STATE: SignInFormActionResult = { ...initialFormState, actionStatus: "idle" };
export const SERVER_VALIDATE = createServerValidateWithTransforms(DEFAULT_VALUES, SignInFormSchema);

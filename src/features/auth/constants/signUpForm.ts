// other libraries
import { z } from "zod";
import { createServerValidate, formOptions, initialFormState } from "@tanstack/react-form/nextjs";
import { SignUpFormSchema } from "@/features/auth/schemas/signUpForm";

// types
import type { SignUpFormActionResult } from "@/features/auth/actions/signUpForm";

// constants
const DEFAULT_VALUES: z.input<typeof SignUpFormSchema> = { name: "", email: "", password: "", confirmPassword: "" };

export const FORM_OPTIONS = formOptions({ defaultValues: DEFAULT_VALUES });
export const INITIAL_FORM_STATE: SignUpFormActionResult = { ...initialFormState, actionStatus: "idle" };
export const SERVER_VALIDATE = createServerValidate({ defaultValues: DEFAULT_VALUES, onServerValidate: SignUpFormSchema });

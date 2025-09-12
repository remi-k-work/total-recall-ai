// other libraries
import { z } from "zod";

// schemas
import { PasswordSchema } from "./password";

export const SignUpFormSchema = z
  .object({
    name: z.string().trim().min(1, "Please provide your name; this is a necessary field").max(25, "Please keep the name to a maximum of 25 characters"),
    email: z.email("The email address you gave appears to be incorrect; please update it"),
    password: PasswordSchema,
    passwordConfirmation: z.string().trim().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.passwordConfirmation, { message: "Passwords do not match", path: ["passwordConfirmation"] });

export type SignUpFormSchemaType = z.infer<typeof SignUpFormSchema>;

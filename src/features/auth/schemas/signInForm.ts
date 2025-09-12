// other libraries
import { z } from "zod";

// schemas
import { PasswordSchema } from "./password";

export const SignInFormSchema = z.object({
  email: z.email("The email address you gave appears to be incorrect; please update it"),
  password: PasswordSchema,
  rememberMe: z.boolean().optional(),
});

export type SignInFormSchemaType = z.infer<typeof SignInFormSchema>;

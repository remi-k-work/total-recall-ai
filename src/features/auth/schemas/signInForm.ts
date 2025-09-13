// other libraries
import { z } from "zod";

// schemas
import { EmailSchema } from "./email";
import { PasswordSchema } from "./password";

export const SignInFormSchema = z.object({ email: EmailSchema, password: PasswordSchema, rememberMe: z.boolean().optional() });

export type SignInFormSchemaType = z.infer<typeof SignInFormSchema>;

// services, features, and other libraries
import { z } from "zod";

// schemas
import { EmailSchema } from "@/schemas/email";
import { PasswordSchema } from "@/schemas/password";

export const SignInFormSchema = z.object({ email: EmailSchema, password: PasswordSchema, rememberMe: z.coerce.boolean() });

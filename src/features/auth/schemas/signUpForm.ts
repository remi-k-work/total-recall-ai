// other libraries
import { z } from "zod";

// schemas
import { EmailSchema } from "./email";
import { PasswordSchema } from "./password";

export const SignUpFormSchema = z
  .object({
    name: z.string().trim().min(1, "Please provide your name; this is a necessary field").max(25, "Please keep the name to a maximum of 25 characters"),
    email: EmailSchema,
    password: PasswordSchema,
    confirmPassword: z.string().trim().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });

export type SignUpFormSchemaType = z.infer<typeof SignUpFormSchema>;

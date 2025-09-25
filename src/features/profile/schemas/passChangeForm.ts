// services, features, and other libraries
import { z } from "zod";

// schemas
import { PasswordSchema } from "@/schemas/password";

export const PassChangeFormSchema = z
  .object({ currentPassword: PasswordSchema, newPassword: PasswordSchema, confirmPassword: z.string().trim().min(1, "Please confirm your password") })
  .refine((data) => data.newPassword === data.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });

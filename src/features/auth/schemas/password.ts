// other libraries
import { z } from "zod";

export const PasswordSchema = z
  .string()
  .trim()
  .min(8, "The password must be at least 8 characters long")
  .max(128, "The password must be at most 128 characters long")
  .regex(/[^A-Za-z0-9]/, "The password must contain at least one special character");

// services, features, and other libraries
import { z } from "zod";

// schemas
import { PasswordSchema } from "./password";

export const ResetPassFormSchema = z.object({ newPassword: PasswordSchema });

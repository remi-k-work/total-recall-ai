// other libraries
import { z } from "zod";

// schemas
import { PasswordSchema } from "./password";

export const ResetPassFormSchema = z.object({ newPassword: PasswordSchema });

export type ResetPassFormSchemaType = z.infer<typeof ResetPassFormSchema>;

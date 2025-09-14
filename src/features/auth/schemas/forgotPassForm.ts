// other libraries
import { z } from "zod";

// schemas
import { EmailSchema } from "./email";

export const ForgotPassFormSchema = z.object({ email: EmailSchema });

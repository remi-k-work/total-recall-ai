// services, features, and other libraries
import { z } from "zod";

// schemas
import { BasePageSchema } from "@/schemas/basePage";

export const ResetPassPageSchema = BasePageSchema.extend({ searchParams: z.object({ token: z.string().trim().min(1) }) });

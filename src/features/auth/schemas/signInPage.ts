// services, features, and other libraries
import { z } from "zod";

// schemas
import { BasePageSchema } from "@/schemas/basePage";

export const SignInPageSchema = BasePageSchema.extend({ searchParams: z.object({ redirect: z.string().trim().min(1).optional() }) });

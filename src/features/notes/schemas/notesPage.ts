// services, features, and other libraries
import { z } from "zod";

// schemas
import { BasePageSchema } from "@/schemas/basePage";

export const NotesPageSchema = BasePageSchema.extend({ searchParams: z.object({ p: z.coerce.number().int().positive().default(1) }) });

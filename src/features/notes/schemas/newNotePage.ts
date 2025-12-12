// services, features, and other libraries
import { z } from "zod";

// schemas
import { BasePageSchema } from "@/schemas/basePage";

export const NewNotePageSchema = BasePageSchema.extend({ searchParams: z.object({ str: z.string().trim().max(25).default("") }) });

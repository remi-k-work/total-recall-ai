// services, features, and other libraries
import { z } from "zod";

// schemas
import { BasePageSchema } from "@/schemas/basePage";

export const EditNotePageSchema = BasePageSchema.extend({ params: z.object({ id: z.uuid() }) });

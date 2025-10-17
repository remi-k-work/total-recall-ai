// services, features, and other libraries
import { z } from "zod";

// schemas
import { BasePageSchema } from "@/schemas/basePage";

export const NotesPageSchema = BasePageSchema.extend({
  searchParams: z.object({
    str: z.string().trim().max(25).default(""),
    crp: z.coerce.number().int().positive().default(1),
    sbf: z.enum(["created_at", "updated_at", "title"]).default("updated_at"),
    sbd: z.enum(["asc", "desc"]).default("desc"),
  }),
});

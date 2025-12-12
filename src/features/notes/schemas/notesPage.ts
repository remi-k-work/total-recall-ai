// services, features, and other libraries
import { z } from "zod";

// schemas
import { BasePageSchema } from "@/schemas/basePage";

export const NotesPageSchema = BasePageSchema.extend({
  searchParams: z.object({
    str: z.string().trim().max(25).default(""),
    crp: z.coerce.number().int().positive().default(1),
    fbt: z
      .preprocess((val) => {
        if (typeof val !== "string" || val.trim() === "") return [];
        return val.split(",");
      }, z.array(z.coerce.number().int().nonnegative()))
      .default([]),
    sbf: z.enum(["title", "created_at", "updated_at"]).default("updated_at"),
    sbd: z.enum(["asc", "desc"]).default("desc"),
  }),
});

// services, features, and other libraries
import { z } from "zod";

// schemas
import { BasePageSchema } from "@/schemas/basePage";

export const NoteDetailsPageSchema = BasePageSchema.extend({
  params: z.object({ id: z.uuid() }),
  searchParams: z.object({ str: z.string().trim().max(25).default("") }),
});

export const NoteDetailsRouteSchema = BasePageSchema.extend({ params: z.object({ id: z.uuid() }), searchParams: z.object({ title: z.coerce.boolean() }) });
export const NotePreferencesRouteSchema = BasePageSchema.extend({ params: z.object({ id: z.uuid() }) });

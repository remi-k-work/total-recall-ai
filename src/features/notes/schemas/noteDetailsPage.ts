// services, features, and other libraries
import { z } from "zod";

// schemas
import { BasePageSchema } from "@/schemas/basePage";

export const NoteDetailsPageSchema = BasePageSchema.extend({ params: z.object({ id: z.uuid() }) });
export const NoteDetailsRouteSchema = BasePageSchema.extend({ params: z.object({ id: z.uuid() }), searchParams: z.object({ title: z.coerce.boolean() }) });

// services, features, and other libraries
import { z } from "zod";

export const BasePageSchema = z.object({
  params: z.record(z.string(), z.string()).catch({}),
  searchParams: z.record(z.string(), z.union([z.string(), z.array(z.string()), z.undefined()])).catch({}),
});

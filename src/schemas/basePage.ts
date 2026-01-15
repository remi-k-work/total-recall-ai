// services, features, and other libraries
import { z } from "zod";
import { Schema } from "effect";

export const BasePageSchema = z.object({
  params: z.record(z.string(), z.string()).catch({}),
  searchParams: z.record(z.string(), z.union([z.string(), z.array(z.string()), z.undefined()])).catch({}),
});

export const BasePageParamsSchema2 = Schema.Record({ key: Schema.String, value: Schema.String });
export const BasePageSearchParamsSchema2 = Schema.Record({
  key: Schema.String,
  value: Schema.Union(Schema.String, Schema.Array(Schema.String), Schema.Array(Schema.Number), Schema.Number, Schema.Undefined),
});

export const BasePageSchema2 = Schema.Struct({
  params: Schema.optionalWith(BasePageParamsSchema2, { default: () => ({}) }),
  searchParams: Schema.optionalWith(BasePageSearchParamsSchema2, { default: () => ({}) }),
});

// services, features, and other libraries
import { Schema } from "effect";

export const BasePageParamsSchema = Schema.Record({ key: Schema.String, value: Schema.String });
export const BasePageSearchParamsSchema = Schema.Record({
  key: Schema.String,
  value: Schema.Union(Schema.String, Schema.Array(Schema.String), Schema.Array(Schema.Number), Schema.Number, Schema.Undefined),
});

export const BasePageSchema = Schema.Struct({
  params: Schema.optionalWith(BasePageParamsSchema, { default: () => ({}) }),
  searchParams: Schema.optionalWith(BasePageSearchParamsSchema, { default: () => ({}) }),
});

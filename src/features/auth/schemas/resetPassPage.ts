// services, features, and other libraries
import { Schema } from "effect";

// schemas
import { BasePageSchema, BasePageSearchParamsSchema } from "@/schemas";

const ResetPassPageSearchParams = Schema.Struct({
  token: Schema.Trim.pipe(Schema.nonEmptyString()),
}).pipe(Schema.extend(BasePageSearchParamsSchema));

export const ResetPassPageSchema = Schema.Struct({
  params: BasePageSchema.fields.params,
  searchParams: ResetPassPageSearchParams,
});

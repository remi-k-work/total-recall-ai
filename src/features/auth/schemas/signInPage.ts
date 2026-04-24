// services, features, and other libraries
import { Schema } from "effect";

// schemas
import { BasePageSchema, BasePageSearchParamsSchema } from "@/schemas";

const SignInPageSearchParams = Schema.Struct({
  redirect: Schema.optional(Schema.Trim.pipe(Schema.nonEmptyString())),
}).pipe(Schema.extend(BasePageSearchParamsSchema));

export const SignInPageSchema = Schema.Struct({
  params: BasePageSchema.fields.params,
  searchParams: SignInPageSearchParams,
});

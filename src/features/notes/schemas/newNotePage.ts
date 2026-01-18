// services, features, and other libraries
import { Schema } from "effect";

// schemas
import { BasePageSchema, BasePageSearchParamsSchema } from "@/schemas/basePageEffect";

const NewNotePageSearchParams = Schema.Struct({
  str: Schema.optionalWith(Schema.Trim.pipe(Schema.maxLength(25)), { default: () => "" }),
}).pipe(Schema.extend(BasePageSearchParamsSchema));

export const NewNotePageSchema = Schema.Struct({
  params: BasePageSchema.fields.params,
  searchParams: Schema.optionalWith(NewNotePageSearchParams, { default: () => ({ str: "" }) }),
});

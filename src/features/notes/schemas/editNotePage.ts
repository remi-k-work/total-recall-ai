// services, features, and other libraries
import { Schema } from "effect";

// schemas
import { BasePageParamsSchema, BasePageSearchParamsSchema } from "@/schemas/basePageEffect";

const EditNotePageParams = Schema.Struct({
  id: Schema.UUID,
}).pipe(Schema.extend(BasePageParamsSchema));

const EditNotePageSearchParams = Schema.Struct({
  str: Schema.optionalWith(Schema.Trim.pipe(Schema.maxLength(25)), { default: () => "" }),
}).pipe(Schema.extend(BasePageSearchParamsSchema));

export const EditNotePageSchema = Schema.Struct({
  params: EditNotePageParams,
  searchParams: Schema.optionalWith(EditNotePageSearchParams, { default: () => ({ str: "" }) }),
});

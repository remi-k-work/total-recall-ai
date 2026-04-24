// services, features, and other libraries
import { Schema } from "effect";

// schemas
import { BasePageParamsSchema, BasePageSearchParamsSchema } from "@/schemas/basePage";

const NoteDetailsPageParams = Schema.Struct({
  id: Schema.UUID,
}).pipe(Schema.extend(BasePageParamsSchema));

const NoteDetailsPageSearchParams = Schema.Struct({
  str: Schema.optionalWith(Schema.Trim.pipe(Schema.maxLength(25)), { default: () => "" }),
}).pipe(Schema.extend(BasePageSearchParamsSchema));

export const NoteDetailsPageSchema = Schema.Struct({
  params: NoteDetailsPageParams,
  searchParams: Schema.optionalWith(NoteDetailsPageSearchParams, { default: () => ({ str: "" }) }),
});

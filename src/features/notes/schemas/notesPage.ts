// services, features, and other libraries
import { Schema } from "effect";

// schemas
import { BasePageSchema, BasePageSearchParamsSchema } from "@/schemas/basePageEffect";

const FbtSchema = Schema.transform(
  Schema.Union(Schema.String, Schema.Undefined),
  Schema.Array(Schema.NumberFromString.pipe(Schema.int(), Schema.nonNegative())),
  {
    decode: (input) => {
      if (typeof input !== "string" || input.trim() === "") {
        return [];
      }
      return input.split(",");
    },
    encode: (output) => output.join(","),
  },
);

const NotesPageSearchParams = Schema.Struct({
  str: Schema.optionalWith(Schema.Trim.pipe(Schema.maxLength(25)), { default: () => "" }),
  crp: Schema.optionalWith(Schema.NumberFromString.pipe(Schema.int(), Schema.positive()), { default: () => 1 }),
  fbt: Schema.optionalWith(FbtSchema, { default: () => [] }),
  sbf: Schema.optionalWith(Schema.Literal("title", "created_at", "updated_at"), { default: () => "updated_at" as const }),
  sbd: Schema.optionalWith(Schema.Literal("asc", "desc"), { default: () => "desc" as const }),
}).pipe(Schema.extend(BasePageSearchParamsSchema));

export const NotesPageSchema = Schema.Struct({
  params: BasePageSchema.fields.params,
  searchParams: Schema.optionalWith(NotesPageSearchParams, {
    default: () => ({ str: "", crp: 1, fbt: [], sbf: "updated_at" as const, sbd: "desc" as const }),
  }),
});

type NotesPageSchemaT = typeof NotesPageSchema.Type;
export type SBF = NotesPageSchemaT["searchParams"]["sbf"];
export type SBD = NotesPageSchemaT["searchParams"]["sbd"];

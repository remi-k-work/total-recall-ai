// services, features, and other libraries
import { z } from "zod";
import { Schema } from "effect";

// schemas
import { BasePageSchema, BasePageSchema2, BasePageSearchParamsSchema2 } from "@/schemas/basePage";

export const NotesPageSchema = BasePageSchema.extend({
  searchParams: z.object({
    str: z.string().trim().max(25).default(""),
    crp: z.coerce.number().int().positive().default(1),
    fbt: z
      .preprocess((val) => {
        if (typeof val !== "string" || val.trim() === "") return [];
        return val.split(",");
      }, z.array(z.coerce.number().int().nonnegative()))
      .default([]),
    sbf: z.enum(["title", "created_at", "updated_at"]).default("updated_at"),
    sbd: z.enum(["asc", "desc"]).default("desc"),
  }),
});

const FbtSchema2 = Schema.transform(
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

const NotesPageSearchParams2 = Schema.Struct({
  str: Schema.optionalWith(Schema.Trim.pipe(Schema.maxLength(25)), { default: () => "" }),
  crp: Schema.optionalWith(Schema.NumberFromString.pipe(Schema.int(), Schema.positive()), { default: () => 1 }),
  fbt: Schema.optionalWith(FbtSchema2, { default: () => [] }),
  sbf: Schema.optionalWith(Schema.Literal("title", "created_at", "updated_at"), { default: () => "updated_at" as const }),
  sbd: Schema.optionalWith(Schema.Literal("asc", "desc"), { default: () => "desc" as const }),
}).pipe(Schema.extend(BasePageSearchParamsSchema2));

export const NotesPageSchema2 = Schema.Struct({
  params: BasePageSchema2.fields.params,
  searchParams: Schema.optionalWith(NotesPageSearchParams2, {
    default: () => ({ str: "", crp: 1, fbt: [], sbf: "updated_at" as const, sbd: "desc" as const }),
  }),
});

type NotesPageSchema2T = typeof NotesPageSchema2.Type;
export type SBF = NotesPageSchema2T["searchParams"]["sbf"];
export type SBD = NotesPageSchema2T["searchParams"]["sbd"];

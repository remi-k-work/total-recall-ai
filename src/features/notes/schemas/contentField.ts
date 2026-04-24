// services, features, and other libraries
import { Schema } from "effect";
import { Field } from "@lucas-barake/effect-form-react";

export const ContentField = Field.makeField(
  "content",
  Schema.Trim.pipe(
    Schema.nonEmptyString({ message: () => "What is the content of the note? This is a mandatory field" }),
    Schema.maxLength(2048, { message: () => "Please keep the content to a maximum of 2048 characters" })
  )
);

// services, features, and other libraries
import { Schema } from "effect";
import { Field } from "@lucas-barake/effect-form-react";

export const TitleField = Field.makeField(
  "title",
  Schema.Trim.pipe(
    Schema.nonEmptyString({ message: () => "Please provide the note title; this is a necessary field" }),
    Schema.maxLength(50, { message: () => "Please keep the title to a maximum of 50 characters" })
  )
);

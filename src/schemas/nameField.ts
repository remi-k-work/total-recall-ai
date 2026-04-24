// services, features, and other libraries
import { Schema } from "effect";
import { Field } from "@lucas-barake/effect-form-react";

export const NameField = <K extends string = "name">(key: K = "name" as K) =>
  Field.makeField(
    key,
    Schema.Trim.pipe(
      Schema.nonEmptyString({ message: () => "Please provide your name; this is a necessary field" }),
      Schema.maxLength(25, { message: () => "Please keep the name to a maximum of 25 characters" })
    )
  );

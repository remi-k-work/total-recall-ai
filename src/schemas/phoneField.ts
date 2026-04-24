// services, features, and other libraries
import { Schema } from "effect";
import { Field } from "@lucas-barake/effect-form-react";

// constants
const PHONE_REGEX = /^[0-9]{3}-[0-9]{3}-[0-9]{3}$/;

export const PhoneField = <K extends string = "phone">(key: K = "phone" as K, nonEmptyMessage?: string) =>
  Field.makeField(
    key,
    Schema.Trim.pipe(
      Schema.nonEmptyString({
        message: () => nonEmptyMessage ?? "Please provide your phone number so we can contact you; the phone number is a required field",
      }),
      Schema.maxLength(11, { message: () => "The phone number must be at most 11 characters long" }),
      Schema.pattern(PHONE_REGEX, {
        message: () => "The phone number you entered does not appear to be valid; please use the following format: 333-444-444",
      })
    )
  );

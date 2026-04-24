// services, features, and other libraries
import { Schema } from "effect";
import { Field } from "@lucas-barake/effect-form-react";

export const RememberMeField = Field.makeField("rememberMe", Schema.Boolean);

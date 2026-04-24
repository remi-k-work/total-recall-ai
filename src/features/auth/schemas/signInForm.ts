// services, features, and other libraries
import { FormBuilder } from "@lucas-barake/effect-form-react";

// schemas
import { EmailField, PasswordField } from "@/schemas";
import { RememberMeField } from "@/features/auth/schemas";

export const signInFormBuilder = FormBuilder.empty.addField(EmailField()).addField(PasswordField()).addField(RememberMeField);

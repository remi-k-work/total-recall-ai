// services, features, and other libraries
import { FormBuilder } from "@lucas-barake/effect-form-react";

// schemas
import { EmailField, NameField, PasswordField } from "@/schemas";

export const signUpFormBuilder = FormBuilder.empty
  .addField(NameField())
  .addField(EmailField())
  .addField(PasswordField())
  .addField(PasswordField("confirmPassword"))
  .refine(({ password, confirmPassword }) => {
    if (password !== confirmPassword) {
      return { path: ["confirmPassword"], message: "Passwords do not match" };
    }
  });

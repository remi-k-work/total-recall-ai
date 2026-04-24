// services, features, and other libraries
import { FormBuilder } from "@lucas-barake/effect-form-react";

// schemas
import { PasswordField } from "@/schemas";

export const passChangeFormBuilder = FormBuilder.empty
  .addField(PasswordField("currentPassword"))
  .addField(PasswordField("newPassword"))
  .addField(PasswordField("confirmPassword"))
  .refine(({ newPassword, confirmPassword }) => {
    if (newPassword !== confirmPassword) {
      return { path: ["confirmPassword"], message: "Passwords do not match" };
    }
  });

export const passSetupFormBuilder = FormBuilder.empty
  .addField(PasswordField("newPassword"))
  .addField(PasswordField("confirmPassword"))
  .refine(({ newPassword, confirmPassword }) => {
    if (newPassword !== confirmPassword) {
      return { path: ["confirmPassword"], message: "Passwords do not match" };
    }
  });

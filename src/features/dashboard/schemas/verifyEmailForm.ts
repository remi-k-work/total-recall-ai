// services, features, and other libraries
import { FormBuilder } from "@lucas-barake/effect-form-react";

// schemas
import { EmailField } from "@/schemas";

export const verifyEmailFormBuilder = FormBuilder.empty.addField(EmailField());

// services, features, and other libraries
import { FormBuilder } from "@lucas-barake/effect-form-react";

// schemas
import { NameField } from "@/schemas";

export const profileDetailsFormBuilder = FormBuilder.empty.addField(NameField());

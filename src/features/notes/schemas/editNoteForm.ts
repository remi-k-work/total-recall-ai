// services, features, and other libraries
import { FormBuilder } from "@lucas-barake/effect-form-react";

// schemas
import { ContentField, TitleField } from "@/features/notes/schemas";

export const editNoteFormBuilder = FormBuilder.empty.addField(TitleField).addField(ContentField);

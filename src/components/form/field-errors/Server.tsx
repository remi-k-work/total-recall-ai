// services, features, and other libraries
import { useFormContext, useFieldContext } from "@/components/form";
import { useStore } from "@tanstack/react-form";

// components
import ErrorList from "./ErrorList";

// types
import type { StandardSchemaV1Issue } from "@tanstack/react-form";

export default function Server() {
  // Get the form context
  const { store } = useFormContext();

  // Get the field context
  const { name } = useFieldContext();

  // Live error messages (unique strings)
  const errorMessages: string[] = useStore(store, (state) => state.errorMap.onServer?.form?.[name])?.map((issue: StandardSchemaV1Issue) => issue.message) ?? [];

  return <ErrorList messages={errorMessages} />;
}

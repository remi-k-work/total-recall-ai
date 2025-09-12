// other libraries
import { useFormContext } from "@/components/form";
import { useFieldContext } from "@/components/form";
import { useStore } from "@tanstack/react-form";

// components
import Server from "./Server";
import Client from "./Client";

// types
import type { StandardSchemaV1Issue } from "@tanstack/react-form";

export default function FieldErrors() {
  // Get the form context
  const { store } = useFormContext();

  // Get the field context
  const { name } = useFieldContext();

  const formServerErrors: Record<string, StandardSchemaV1Issue[]> | undefined = useStore(store, (state) => state.errorMap.onServer?.form);

  return <div className="min-h-14">{formServerErrors?.[name] ? <Server /> : <Client />}</div>;
}

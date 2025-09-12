// other libraries
import { useFormContext } from "@/components/form";
import { useFieldContext } from "@/components/form";
import { useStore } from "@tanstack/react-form";
import useAnimatedErrors from "@/hooks/useAnimatedErrors";

// components
import { ErrorLine } from "./ErrorLine";

// types
import type { StandardSchemaV1Issue } from "@tanstack/react-form";

export default function Server() {
  // Get the form context
  const { store } = useFormContext();

  // Get the field context
  const { name } = useFieldContext();

  // Live error messages (unique strings)
  const liveErrorMessages: string[] =
    useStore(store, (state) => state.errorMap.onServer?.form?.[name])?.map((issue: StandardSchemaV1Issue) => issue.message) ?? [];

  const animatedErrors = useAnimatedErrors(liveErrorMessages);

  return animatedErrors.map(({ message, isShowing }) => <ErrorLine key={message} isShowing={isShowing} message={message} />);
}

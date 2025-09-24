// services, features, and other libraries
import { useFieldContext } from "@/components/form";

// components
import ErrorList from "./ErrorList";

// types
import type { ZodError } from "zod";

export default function Client() {
  // Get the field context
  const {
    state: {
      meta: { errors, isPristine, isTouched },
    },
  } = useFieldContext();

  // Only render errors once the field has been touched and is no longer pristine
  const errorMessages = !isPristine && isTouched ? errors.map(({ message }: ZodError) => message) : [];

  return <ErrorList messages={errorMessages} />;
}

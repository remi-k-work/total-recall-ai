// other libraries
import { useFieldContext } from "@/components/form";
import useAnimatedErrors from "@/hooks/useAnimatedErrors";

// components
import { ErrorLine } from "./ErrorLine";

// types
import type { ZodError } from "zod";

export default function Client() {
  // Get the field context
  const {
    state: {
      meta: { errors, isPristine, isTouched },
    },
  } = useFieldContext();

  // Live error messages (unique strings)
  const liveErrorMessages = errors.map(({ message }: ZodError) => message);

  // Only render errors once the field has been touched and is no longer pristine
  const animatedErrors = useAnimatedErrors(liveErrorMessages, { gated: true, show: !isPristine && isTouched });

  return animatedErrors.map(({ message, isShowing }) => <ErrorLine key={message} isShowing={isShowing} message={message} />);
}

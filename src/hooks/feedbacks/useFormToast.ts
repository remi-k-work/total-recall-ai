// react
import { useCallback } from "react";

// components
import { toast } from "sonner";

// types
type ActionStatus = "idle" | "succeeded" | "failed" | "invalid" | "authError" | "demoMode";
type ToastMessages = Pick<Record<ActionStatus, string>, "succeeded"> & Partial<Record<Exclude<ActionStatus, "idle" | "succeeded" | "invalid">, string>>;

// Generic hook for displaying toast notifications for form actions
export default function useFormToastFeedback(formName: string, { succeeded, failed, authError }: ToastMessages) {
  return useCallback(
    (actionStatus: ActionStatus) => {
      if (actionStatus === "succeeded") {
        // "succeeded" always needs a custom message
        toast.success("SUCCESS!", { description: succeeded });
        // "invalid" always generated dynamically with the provided form name
      } else if (actionStatus === "invalid") {
        toast.warning("MISSING FIELDS!", { description: `Please correct the ${formName} form fields and try again.` });
      } else if (actionStatus === "failed") {
        // "failed" may fall back to defaults if not provided
        toast.error("SERVER ERROR!", { description: failed ?? `The ${formName} form was not submitted successfully; please try again later.` });
      } else if (actionStatus === "authError") {
        // "authError" may fall back to defaults if not provided
        toast.error("AUTHORIZATION ERROR!", { description: authError ?? "Something went wrong; please try again later." });
      } else if (actionStatus === "demoMode") {
        toast.error("DEMO MODE!", { description: "This action is disabled in demo mode." });
      }
    },
    [formName, succeeded, failed, authError],
  );
}

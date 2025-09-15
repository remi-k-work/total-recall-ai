// react
import { useEffect } from "react";

// components
import { toast } from "sonner";

// types
import type { ResetPassFormActionResult } from "@/features/auth/actions/resetPassForm";

// Provide feedback to the user regarding reset pass form actions
export default function useResetPassFormFeedback({ actionStatus, errors }: ResetPassFormActionResult, reset: () => void) {
  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Success!", { description: "The password has been reset. Please sign in with your new password." });

      // Reset the entire form after successful submission
      reset();
    } else if (actionStatus === "invalid") {
      toast.warning("Missing fields!", { description: "Please correct the reset password form fields and try again." });
    } else if (actionStatus === "failed") {
      toast.error("Server error!", { description: "The reset password form was not submitted successfully; please try again later." });
    }
  }, [actionStatus, errors, reset]);
}

// react
import { useEffect } from "react";

// components
import { toast } from "sonner";

// types
import type { ForgotPassFormActionResult } from "@/features/auth/actions/forgotPassForm";

// Provide feedback to the user regarding forgot pass form actions
export default function useForgotPassFormFeedback({ actionStatus, errors }: ForgotPassFormActionResult, reset: () => void) {
  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Success!", { description: "We have sent the password reset link." });

      // Reset the entire form after successful submission
      reset();
    } else if (actionStatus === "invalid") {
      toast.warning("Missing fields!", { description: "Please correct the forgot password form fields and try again." });
    } else if (actionStatus === "failed") {
      toast.error("Server error!", { description: "The forgot password form was not submitted successfully; please try again later." });
    }
  }, [actionStatus, errors, reset]);
}

// react
import { useEffect } from "react";

// components
import { toast } from "sonner";

// types
import type { SignUpFormActionResult } from "@/features/auth/actions/signUpForm";

// Provide feedback to the user regarding sign up form actions
export default function useSignUpFormFeedback({ actionStatus }: SignUpFormActionResult, reset: () => void) {
  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Success!", { description: "You signed up successfully." });

      // Reset the entire form after successful submission
      reset();
    } else if (actionStatus === "invalid") {
      toast.warning("Missing fields!", { description: "Please correct the sign up form fields and try again." });
    } else if (actionStatus === "failed") {
      toast.error("Server error!", { description: "The sign up form was not submitted successfully; please try again later." });
    }
  }, [actionStatus, reset]);
}

// react
import { useEffect } from "react";

// components
import { toast } from "sonner";

// types
import type { SignInFormActionResult } from "@/features/auth/actions/signInForm";

// Provide feedback to the user regarding sign in form actions
export default function useSignInFormFeedback({ actionStatus, errors }: SignInFormActionResult, reset: () => void) {
  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Success!", { description: "You signed in successfully." });

      // Reset the entire form after successful submission
      reset();
    } else if (actionStatus === "invalid") {
      toast.warning("Missing fields!", { description: "Please correct the sign in form fields and try again." });
    } else if (actionStatus === "failed") {
      toast.error("Server error!", { description: "The sign in form was not submitted successfully; please try again later." });
    }
  }, [actionStatus, errors, reset]);
}

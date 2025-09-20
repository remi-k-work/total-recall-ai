// react
import { useEffect } from "react";

// components
import { toast } from "sonner";

// types
import type { EmailChangeFormActionResult } from "@/features/profile/actions/emailChangeForm";

// Provide feedback to the user regarding email change form actions
export default function useEmailChangeFormFeedback({ actionStatus, actionError, needsApproval, errors }: EmailChangeFormActionResult, reset: () => void) {
  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Success!", {
        // There are two successful outcomes here, but only users with verified emails need to additionally approve their email change
        description: needsApproval
          ? "The email change has been initiated and needs to be approved. Please check your current email address for the approval link."
          : "Your email has been changed successfully. A verification email has been sent to your new email address.",
      });

      // Reset the entire form after successful submission
      reset();
    } else if (actionStatus === "invalid") {
      toast.warning("Missing fields!", { description: "Please correct the email change form fields and try again." });
    } else if (actionStatus === "failed") {
      toast.error("Server error!", { description: "The email change form was not submitted successfully; please try again later." });
    } else if (actionStatus === "authError") {
      toast.error("Authorization error!", { description: actionError });
    }
  }, [actionStatus, actionError, needsApproval, errors, reset]);
}

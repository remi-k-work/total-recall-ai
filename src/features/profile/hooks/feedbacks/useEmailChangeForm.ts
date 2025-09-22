// react
import { useEffect } from "react";

// services, features, and other libraries
import { authClient } from "@/services/better-auth/auth-client";

// components
import { toast } from "sonner";

// types
import type { EmailChangeFormActionResult } from "@/features/profile/actions/emailChangeForm";

// Provide feedback to the user regarding this form actions
export default function useEmailChangeFormFeedback({ actionStatus, actionError, needsApproval, errors }: EmailChangeFormActionResult, reset: () => void) {
  // Access the user session data from the client side
  const { refetch } = authClient.useSession();

  useEffect(() => {
    if (actionStatus === "succeeded") {
      // Display a success message
      toast.success("SUCCESS!", {
        // There are two successful outcomes here, but only users with verified emails need to additionally approve their email change
        description: needsApproval
          ? "The email change has been initiated and needs to be approved. Please check your current email address for the approval link."
          : "Your email has been changed successfully. A verification email has been sent to your new email address.",
      });

      // Reset the entire form after successful submission
      reset();

      // Refetch the user session data with the modified changes
      refetch();
    } else if (actionStatus === "invalid") {
      toast.warning("MISSING FIELDS!", { description: "Please correct the [EMAIL CHANGE] form fields and try again." });
    } else if (actionStatus === "failed") {
      toast.error("SERVER ERROR!", { description: "The [EMAIL CHANGE] form was not submitted successfully; please try again later." });
    } else if (actionStatus === "authError") {
      toast.error("AUTHORIZATION ERROR!", { description: actionError });
    }
  }, [actionStatus, actionError, needsApproval, errors, reset, refetch]);
}

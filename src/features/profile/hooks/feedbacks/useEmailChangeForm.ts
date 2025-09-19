// react
import { useEffect } from "react";

// services, features, and other libraries
import { authClient } from "@/services/better-auth/auth-client";

// components
import { toast } from "sonner";

// types
import type { EmailChangeFormActionResult } from "@/features/profile/actions/emailChangeForm";

// Provide feedback to the user regarding email change form actions
export default function useEmailChangeFormFeedback({ actionStatus, actionError, errors }: EmailChangeFormActionResult, reset: () => void) {
  // Access the user session data from the client side
  const { data: userSessionData } = authClient.useSession();

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Success!", {
        // There are two successful outcomes here, but only users with verified emails need to additionally approve their email change
        description: userSessionData?.user.emailVerified
          ? "The email change has been initiated and needs to be approved. Please check your current email for the approval link."
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
  }, [actionStatus, actionError, errors, reset, userSessionData]);
}

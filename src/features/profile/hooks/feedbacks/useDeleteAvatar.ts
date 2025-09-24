// react
import { useEffect } from "react";

// services, features, and other libraries
import { authClient } from "@/services/better-auth/auth-client";
import useFormToastFeedback from "@/hooks/feedbacks/useFormToast";

// types
import type { DeleteAvatarActionResult } from "@/features/profile/actions/deleteAvatar";

// constants
const FORM_NAME = "[PROFILE DETAILS]";
const SUCCEEDED_MESSAGE = "Your avatar has been deleted.";
const FAILED_MESSAGE = "Your avatar could not be deleted; please try again later.";

// Provide feedback to the user regarding this server action
export default function useDeleteAvatarFeedback({ actionStatus, actionError }: DeleteAvatarActionResult) {
  // Access the user session data from the client side
  const { refetch } = authClient.useSession();

  // Generic hook for displaying toast notifications for form actions
  const showToast = useFormToastFeedback(FORM_NAME, { succeeded: SUCCEEDED_MESSAGE, failed: FAILED_MESSAGE, authError: actionError });

  useEffect(() => {
    if (actionStatus === "succeeded") {
      // Display a success message
      showToast("succeeded");

      // Refetch the user session data with the modified changes
      refetch();
    } else {
      // All other statuses ("invalid", "failed", "authError") handled centrally
      showToast(actionStatus);
    }
  }, [actionStatus, showToast, refetch]);
}

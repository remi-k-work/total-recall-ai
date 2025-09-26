// react
import { useEffect } from "react";

// services, features, and other libraries
import useFormToastFeedback from "@/hooks/feedbacks/useFormToast";

// types
import type { SignOutEverywhereActionResult } from "@/features/profile/actions/signOutEverywhere";

// constants
const FORM_NAME = "[SIGN OUT EVERYWHERE]";
const SUCCEEDED_MESSAGE = "You signed out from all devices successfully.";

// Provide feedback to the user regarding this server action
export default function useSignOutEverywhereFeedback({ actionStatus, actionError }: SignOutEverywhereActionResult) {
  // Generic hook for displaying toast notifications for form actions
  const showToast = useFormToastFeedback(FORM_NAME, { succeeded: SUCCEEDED_MESSAGE, authError: actionError });

  useEffect(() => {
    if (actionStatus === "succeeded") {
      // Display a success message
      showToast("succeeded");
    } else {
      // All other statuses ("invalid", "failed", "authError") handled centrally
      showToast(actionStatus);
    }
  }, [actionStatus, showToast]);
}

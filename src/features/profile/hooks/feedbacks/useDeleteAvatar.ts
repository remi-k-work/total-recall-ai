// react
import { useEffect, useEffectEvent } from "react";

// services, features, and other libraries
import { authClient } from "@/services/better-auth/auth-client";
import useFormToastFeedback from "@/hooks/feedbacks/useFormToast";
import useDemoModeGuard from "@/hooks/useDemoModeGuard";

// types
import type { RefObject } from "react";
import type { DeleteAvatarActionResult } from "@/features/profile/actions/deleteAvatar";

// constants
const FORM_NAME = "[PROFILE DETAILS]";
const SUCCEEDED_MESSAGE = "Your avatar has been deleted.";
const FAILED_MESSAGE = "Your avatar could not be deleted; please try again later.";

// Provide feedback to the user regarding this server action
export default function useDeleteAvatarFeedback(hasPressedConfirmRef: RefObject<boolean>, { actionStatus, actionError }: DeleteAvatarActionResult) {
  // Access the user session data from the client side
  const { refetch } = authClient.useSession();

  // Generic hook for displaying toast notifications for form actions
  const showToast = useFormToastFeedback(FORM_NAME, { succeeded: SUCCEEDED_MESSAGE, failed: FAILED_MESSAGE, authError: actionError });

  // Custom hook that observes an action's status and automatically opens the global demo mode modal
  const guardForDemoMode = useDemoModeGuard(actionStatus);

  // Function to be called when feedback is needed
  const onFeedbackNeeded = useEffectEvent(() => {
    if (actionStatus === "succeeded") {
      // Display a success message
      showToast("succeeded");

      // Refetch the user session data with the modified changes
      refetch();
    } else {
      // Was a restricted operation attempted under the demo account? Inform the user
      guardForDemoMode();

      // All other statuses ("invalid", "failed", "authError") handled centrally
      showToast(actionStatus);
    }
  });

  useEffect(() => {
    if (hasPressedConfirmRef.current === false) return;
    onFeedbackNeeded();
  }, [hasPressedConfirmRef.current, actionStatus]);
}

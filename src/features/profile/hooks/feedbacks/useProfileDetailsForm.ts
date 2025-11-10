// react
import { useEffect, useEffectEvent } from "react";

// services, features, and other libraries
import { authClient } from "@/services/better-auth/auth-client";
import usePermanentMessageFeedback from "@/hooks/feedbacks/usePermanentMessage";
import useFormToastFeedback from "@/hooks/feedbacks/useFormToast";
import useDemoModeGuard from "@/hooks/useDemoModeGuard";

// types
import type { RefObject } from "react";
import type { ProfileDetailsFormActionResult } from "@/features/profile/actions/profileDetailsForm";
import type { AnyFormApi } from "@tanstack/react-form";

// constants
const FORM_NAME = "[PROFILE DETAILS]";
const SUCCEEDED_MESSAGE = "Your profile details have been updated.";

// Provide feedback to the user regarding this form actions
export default function useProfileDetailsFormFeedback(
  hasPressedSubmitRef: RefObject<boolean>,
  { actionStatus, actionError, errors }: ProfileDetailsFormActionResult,
  reset: () => void,
  formStore: AnyFormApi["store"],
) {
  // Access the user session data from the client side
  const { refetch } = authClient.useSession();

  // Generic hook for managing a permanent feedback message
  const { feedbackMessage, showFeedbackMessage, hideFeedbackMessage } = usePermanentMessageFeedback(formStore);

  // Generic hook for displaying toast notifications for form actions
  const showToast = useFormToastFeedback(FORM_NAME, { succeeded: SUCCEEDED_MESSAGE, authError: actionError });

  // Custom hook that observes an action's status and automatically opens the global demo mode modal
  const guardForDemoMode = useDemoModeGuard(actionStatus);

  // Function to be called when feedback is needed
  const onFeedbackNeeded = useEffectEvent(() => {
    if (actionStatus === "succeeded") {
      // Display a success message
      showToast("succeeded");

      // Reset the entire form after successful submission
      reset();

      // Refetch the user session data with the modified changes
      refetch();

      // Show the permanent feedback message as well
      showFeedbackMessage(SUCCEEDED_MESSAGE);
    } else {
      // Was a restricted operation attempted under the demo account? Inform the user
      guardForDemoMode();

      // All other statuses ("invalid", "failed", "authError") handled centrally
      showToast(actionStatus);
    }
  });

  useEffect(() => {
    if (hasPressedSubmitRef.current === false) return;
    onFeedbackNeeded();
  }, [hasPressedSubmitRef.current, actionStatus, errors]);

  return { feedbackMessage, hideFeedbackMessage };
}

// react
import { useEffect, useEffectEvent } from "react";

// services, features, and other libraries
import usePermanentMessageFeedbackLoc from "@/hooks/feedbacks/usePermanentMessageLoc";
import useFormToastFeedback from "@/hooks/feedbacks/useFormToast";
import useDemoModeGuard from "@/hooks/useDemoModeGuard";

// types
import type { RefObject } from "react";
import type { VerifyEmailActionResult } from "@/features/dashboard/actions/verifyEmail";

// constants
const FORM_NAME = "[VERIFY EMAIL]";
const SUCCEEDED_MESSAGE = "A verification email has been sent to your current email address. Please check your inbox.";

// Provide feedback to the user regarding this server action
export default function useVerifyEmailFeedback(hasPressedSubmitRef: RefObject<boolean>, { actionStatus, actionError }: VerifyEmailActionResult) {
  // Generic hook for managing a permanent feedback message
  const { feedbackMessage, showFeedbackMessage, hideFeedbackMessage } = usePermanentMessageFeedbackLoc();

  // Generic hook for displaying toast notifications for form actions
  const showToast = useFormToastFeedback(FORM_NAME, { succeeded: SUCCEEDED_MESSAGE, authError: actionError });

  // Custom hook that observes an action's status and automatically opens the global demo mode modal
  const guardForDemoMode = useDemoModeGuard(actionStatus);

  // Function to be called when feedback is needed
  const onFeedbackNeeded = useEffectEvent(() => {
    if (actionStatus === "succeeded") {
      // Display a success message
      showToast("succeeded");

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
  }, [hasPressedSubmitRef.current, actionStatus]);

  return { feedbackMessage, hideFeedbackMessage };
}

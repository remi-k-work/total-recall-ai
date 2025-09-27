// react
import { useEffect } from "react";

// services, features, and other libraries
import usePermanentMessageFeedbackLoc from "@/hooks/feedbacks/usePermanentMessageLoc";
import useFormToastFeedback from "@/hooks/feedbacks/useFormToast";

// types
import type { VerifyEmailActionResult } from "@/features/dashboard/actions/verifyEmail";

// constants
const FORM_NAME = "[VERIFY EMAIL]";
const SUCCEEDED_MESSAGE = "A verification email has been sent to your current email address. Please check your inbox.";

// Provide feedback to the user regarding this server action
export default function useVerifyEmailFeedback({ actionStatus, actionError }: VerifyEmailActionResult) {
  // Generic hook for managing a permanent feedback message
  const { feedbackMessage, showFeedbackMessage, hideFeedbackMessage } = usePermanentMessageFeedbackLoc();

  // Generic hook for displaying toast notifications for form actions
  const showToast = useFormToastFeedback(FORM_NAME, { succeeded: SUCCEEDED_MESSAGE, authError: actionError });

  useEffect(() => {
    if (actionStatus === "succeeded") {
      // Display a success message
      showToast("succeeded");

      // Show the permanent feedback message as well
      showFeedbackMessage(SUCCEEDED_MESSAGE);
    } else {
      // All other statuses ("invalid", "failed", "authError") handled centrally
      showToast(actionStatus);
    }
  }, [actionStatus, showToast, showFeedbackMessage]);

  return { feedbackMessage, hideFeedbackMessage };
}

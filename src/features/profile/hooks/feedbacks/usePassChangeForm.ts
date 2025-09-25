// react
import { useEffect } from "react";

// services, features, and other libraries
import usePermanentMessageFeedback from "@/hooks/feedbacks/usePermanentMessage";
import useFormToastFeedback from "@/hooks/feedbacks/useFormToast";

// types
import type { PassChangeFormActionResult } from "@/features/profile/actions/passChangeForm";
import type { AnyFormApi } from "@tanstack/react-form";

// constants
const FORM_NAME = "[PASSWORD CHANGE]";
const SUCCEEDED_MESSAGE = "Your password has been changed.";

// Provide feedback to the user regarding this form actions
export default function usePassChangeFormFeedback(
  { actionStatus, actionError, errors }: PassChangeFormActionResult,
  reset: () => void,
  formStore: AnyFormApi["store"],
) {
  // Generic hook for managing a permanent feedback message
  const { feedbackMessage, showFeedbackMessage, hideFeedbackMessage } = usePermanentMessageFeedback(formStore);

  // Generic hook for displaying toast notifications for form actions
  const showToast = useFormToastFeedback(FORM_NAME, { succeeded: SUCCEEDED_MESSAGE, authError: actionError });

  useEffect(() => {
    if (actionStatus === "succeeded") {
      // Display a success message
      showToast("succeeded");

      // Reset the entire form after successful submission
      reset();

      // Show the permanent feedback message as well
      showFeedbackMessage(SUCCEEDED_MESSAGE);
    } else {
      // All other statuses ("invalid", "failed", "authError") handled centrally
      showToast(actionStatus);
    }
  }, [actionStatus, errors, showToast, reset, showFeedbackMessage]);

  return { feedbackMessage, hideFeedbackMessage };
}

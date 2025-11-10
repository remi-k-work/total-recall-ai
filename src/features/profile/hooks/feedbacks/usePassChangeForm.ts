// react
import { useEffect, useEffectEvent } from "react";

// services, features, and other libraries
import usePermanentMessageFeedback from "@/hooks/feedbacks/usePermanentMessage";
import useFormToastFeedback from "@/hooks/feedbacks/useFormToast";
import useDemoModeGuard from "@/hooks/useDemoModeGuard";

// types
import type { RefObject } from "react";
import type { PassChangeFormActionResult } from "@/features/profile/actions/passChangeForm";
import type { AnyFormApi } from "@tanstack/react-form";

// constants
const FORM_NAME_CHANGE = "[PASSWORD CHANGE]";
const SUCCEEDED_MESSAGE_CHANGE = "Your password has been changed.";
const FORM_NAME_SETUP = "[PASSWORD SETUP]";
const SUCCEEDED_MESSAGE_SETUP = "Your password has been setup.";

// Provide feedback to the user regarding this form actions
export default function usePassChangeFormFeedback(
  hasPressedSubmitRef: RefObject<boolean>,
  { actionStatus, actionError, errors }: PassChangeFormActionResult,
  reset: () => void,
  formStore: AnyFormApi["store"],
  hasCredential: boolean,
) {
  // Generic hook for managing a permanent feedback message
  const { feedbackMessage, showFeedbackMessage, hideFeedbackMessage } = usePermanentMessageFeedback(formStore);

  // Generic hook for displaying toast notifications for form actions
  const showToast = useFormToastFeedback(hasCredential ? FORM_NAME_CHANGE : FORM_NAME_SETUP, {
    succeeded: hasCredential ? SUCCEEDED_MESSAGE_CHANGE : SUCCEEDED_MESSAGE_SETUP,
    authError: actionError,
  });

  // Custom hook that observes an action's status and automatically opens the global demo mode modal
  const guardForDemoMode = useDemoModeGuard(actionStatus);

  // Function to be called when feedback is needed
  const onFeedbackNeeded = useEffectEvent(() => {
    if (actionStatus === "succeeded") {
      // Display a success message
      showToast("succeeded");

      // Reset the entire form after successful submission
      reset();

      // Show the permanent feedback message as well
      showFeedbackMessage(hasCredential ? SUCCEEDED_MESSAGE_CHANGE : SUCCEEDED_MESSAGE_SETUP);
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

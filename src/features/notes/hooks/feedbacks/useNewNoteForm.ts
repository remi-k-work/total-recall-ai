// react
import { useEffect, useEffectEvent } from "react";

// next
import { redirect } from "next/navigation";

// services, features, and other libraries
import usePermanentMessageFeedback from "@/hooks/feedbacks/usePermanentMessage";
import useFormToastFeedback from "@/hooks/feedbacks/useFormToast";
import useDemoModeGuard from "@/hooks/useDemoModeGuard2";

// types
import type { RefObject } from "react";
import type { NewNoteFormActionResult } from "@/features/notes/actions/newNoteForm";
import type { AnyFormApi } from "@tanstack/react-form";

// constants
const FORM_NAME = "[NEW NOTE]";
const SUCCEEDED_MESSAGE = "The new note has been created.";

// Provide feedback to the user regarding this form actions
export default function useNewNoteFormFeedback(
  hasPressedSubmitRef: RefObject<boolean>,
  { actionStatus, errors }: NewNoteFormActionResult,
  reset: () => void,
  formStore: AnyFormApi["store"],
) {
  // Generic hook for managing a permanent feedback message
  const { feedbackMessage, showFeedbackMessage, hideFeedbackMessage } = usePermanentMessageFeedback(formStore);

  // Generic hook for displaying toast notifications for form actions
  const showToast = useFormToastFeedback(FORM_NAME, { succeeded: SUCCEEDED_MESSAGE });

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
      showFeedbackMessage(SUCCEEDED_MESSAGE);

      // Redirect the user after successful note creation
      return setTimeout(() => redirect("/notes"), 3000);
    } else {
      // Was a restricted operation attempted under the demo account? Inform the user
      guardForDemoMode();

      // All other statuses ("invalid", "failed", "authError") handled centrally
      showToast(actionStatus);
    }
  });

  useEffect(() => {
    if (hasPressedSubmitRef.current === false) return;
    const timeoutId = onFeedbackNeeded();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [hasPressedSubmitRef.current, actionStatus, errors]);

  return { feedbackMessage, hideFeedbackMessage };
}

// react
import { useEffect } from "react";

// services, features, and other libraries
import usePermanentMessageFeedback from "@/hooks/feedbacks/usePermanentMessage";
import useFormToastFeedback from "@/hooks/feedbacks/useFormToast";

// types
import type { NewNoteFormActionResult } from "@/features/notes/actions/newNoteForm";
import type { AnyFormApi } from "@tanstack/react-form";

// constants
const FORM_NAME = "[NEW NOTE]";
const SUCCEEDED_MESSAGE = "The new note has been created.";

// Provide feedback to the user regarding this form actions
export default function useNewNoteFormFeedback({ actionStatus, errors }: NewNoteFormActionResult, reset: () => void, formStore: AnyFormApi["store"]) {
  // Generic hook for managing a permanent feedback message
  const { feedbackMessage, showFeedbackMessage, hideFeedbackMessage } = usePermanentMessageFeedback(formStore);

  // Generic hook for displaying toast notifications for form actions
  const showToast = useFormToastFeedback(FORM_NAME, { succeeded: SUCCEEDED_MESSAGE });

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

// react
import { useEffect } from "react";

// next
import { useRouter } from "next/navigation";

// services, features, and other libraries
import usePermanentMessageFeedback from "@/hooks/feedbacks/usePermanentMessage";
import useFormToastFeedback from "@/hooks/feedbacks/useFormToast";

// types
import type { EditNoteFormActionResult } from "@/features/notes/actions/editNoteForm";
import type { AnyFormApi } from "@tanstack/react-form";

// constants
const FORM_NAME = "[EDIT NOTE]";
const SUCCEEDED_MESSAGE = "The note has been updated.";

// Provide feedback to the user regarding this form actions
export default function useEditNoteFormFeedback({ actionStatus, errors }: EditNoteFormActionResult, reset: () => void, formStore: AnyFormApi["store"]) {
  // To be able to redirect the user after a successful note update
  const router = useRouter();

  // Generic hook for managing a permanent feedback message
  const { feedbackMessage, showFeedbackMessage, hideFeedbackMessage } = usePermanentMessageFeedback(formStore);

  // Generic hook for displaying toast notifications for form actions
  const showToast = useFormToastFeedback(FORM_NAME, { succeeded: SUCCEEDED_MESSAGE });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (actionStatus === "succeeded") {
      // Display a success message
      showToast("succeeded");

      // Reset the entire form after successful submission
      reset();

      // Show the permanent feedback message as well
      showFeedbackMessage(SUCCEEDED_MESSAGE);

      // Redirect the user after successful note update
      timeoutId = setTimeout(() => router.push("/notes"), 3000);
    } else {
      // All other statuses ("invalid", "failed", "authError") handled centrally
      showToast(actionStatus);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [actionStatus, errors, showToast, reset, showFeedbackMessage, router]);

  return { feedbackMessage, hideFeedbackMessage };
}

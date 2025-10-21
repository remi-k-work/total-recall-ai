// react
import { useEffect } from "react";

// services, features, and other libraries
import useFormToastFeedback from "@/hooks/feedbacks/useFormToast";

// types
import type { DeleteNoteActionResult } from "@/features/notes/actions/deleteNote";

// constants
const FORM_NAME = "[DELETE NOTE]";
const SUCCEEDED_MESSAGE = "Your note has been deleted.";
const FAILED_MESSAGE = "Your note could not be deleted; please try again later.";

// Provide feedback to the user regarding this server action
export default function useDeleteNoteFeedback({ actionStatus }: DeleteNoteActionResult) {
  // Generic hook for displaying toast notifications for form actions
  const showToast = useFormToastFeedback(FORM_NAME, { succeeded: SUCCEEDED_MESSAGE, failed: FAILED_MESSAGE });

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

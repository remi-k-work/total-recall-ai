// react
import { useEffect, useEffectEvent } from "react";

// next
import { redirect } from "next/navigation";

// services, features, and other libraries
import useFormToastFeedback from "@/hooks/feedbacks/useFormToast";
import useDemoModeGuard from "@/hooks/useDemoModeGuard";

// types
import type { RefObject } from "react";
import type { DeleteNoteActionResult } from "@/features/notes/actions/deleteNote";

// constants
const FORM_NAME = "[DELETE NOTE]";
const SUCCEEDED_MESSAGE = "Your note has been deleted.";
const FAILED_MESSAGE = "Your note could not be deleted; please try again later.";

// Provide feedback to the user regarding this server action
export default function useDeleteNoteFeedback(hasPressedConfirmRef: RefObject<boolean>, { actionStatus }: DeleteNoteActionResult) {
  // Generic hook for displaying toast notifications for form actions
  const showToast = useFormToastFeedback(FORM_NAME, { succeeded: SUCCEEDED_MESSAGE, failed: FAILED_MESSAGE });

  // Custom hook that observes an action's status and automatically opens the global demo mode modal
  const guardForDemoMode = useDemoModeGuard(actionStatus);

  // Function to be called when feedback is needed
  const onFeedbackNeeded = useEffectEvent(() => {
    if (actionStatus === "succeeded") {
      // Display a success message
      showToast("succeeded");

      // Redirect the user after successful note deletion
      return setTimeout(() => redirect("/notes"), 3000);
    } else {
      // Was a restricted operation attempted under the demo account? Inform the user
      guardForDemoMode();

      // All other statuses ("invalid", "failed", "authError") handled centrally
      showToast(actionStatus);
    }
  });

  useEffect(() => {
    if (hasPressedConfirmRef.current === false) return;
    const timeoutId = onFeedbackNeeded();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [hasPressedConfirmRef.current, actionStatus]);
}

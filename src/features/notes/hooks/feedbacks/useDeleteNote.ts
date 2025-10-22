// react
import { useEffect } from "react";

// next
import { useRouter } from "next/navigation";

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
  // To be able to redirect the user after a successful note deletion
  const router = useRouter();

  // Generic hook for displaying toast notifications for form actions
  const showToast = useFormToastFeedback(FORM_NAME, { succeeded: SUCCEEDED_MESSAGE, failed: FAILED_MESSAGE });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (actionStatus === "succeeded") {
      // Display a success message
      showToast("succeeded");

      // Redirect the user after successful note deletion
      timeoutId = setTimeout(() => router.push("/notes"), 3000);
    } else {
      // All other statuses ("invalid", "failed", "authError") handled centrally
      showToast(actionStatus);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [actionStatus, showToast, router]);
}

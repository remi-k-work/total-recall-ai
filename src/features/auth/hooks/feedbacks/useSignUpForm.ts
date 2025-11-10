// react
import { useEffect, useEffectEvent } from "react";

// next
import { redirect } from "next/navigation";

// services, features, and other libraries
import usePermanentMessageFeedback from "@/hooks/feedbacks/usePermanentMessage";
import useFormToastFeedback from "@/hooks/feedbacks/useFormToast";

// types
import type { RefObject } from "react";
import type { SignUpFormActionResult } from "@/features/auth/actions/signUpForm";
import type { AnyFormApi } from "@tanstack/react-form";

// constants
const FORM_NAME = "[SIGN UP]";
const SUCCEEDED_MESSAGE = "You signed up successfully.";

// Provide feedback to the user regarding this form actions
export default function useSignUpFormFeedback(
  hasPressedSubmitRef: RefObject<boolean>,
  { actionStatus, actionError, errors }: SignUpFormActionResult,
  reset: () => void,
  formStore: AnyFormApi["store"],
) {
  // Generic hook for managing a permanent feedback message
  const { feedbackMessage, showFeedbackMessage, hideFeedbackMessage } = usePermanentMessageFeedback(formStore);

  // Generic hook for displaying toast notifications for form actions
  const showToast = useFormToastFeedback(FORM_NAME, { succeeded: SUCCEEDED_MESSAGE, authError: actionError });

  // Function to be called when feedback is needed
  const onFeedbackNeeded = useEffectEvent(() => {
    if (actionStatus === "succeeded") {
      // Display a success message
      showToast("succeeded");

      // Reset the entire form after successful submission
      reset();

      // Show the permanent feedback message as well
      showFeedbackMessage(SUCCEEDED_MESSAGE);

      // Redirect the user after successful sign up
      return setTimeout(() => redirect("/dashboard"), 3000);
    } else {
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

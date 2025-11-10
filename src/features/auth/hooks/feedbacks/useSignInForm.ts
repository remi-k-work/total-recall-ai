// react
import { useEffect, useEffectEvent } from "react";

// next
import { redirect } from "next/navigation";

// services, features, and other libraries
import usePermanentMessageFeedback from "@/hooks/feedbacks/usePermanentMessage";
import useFormToastFeedback from "@/hooks/feedbacks/useFormToast";

// types
import type { RefObject } from "react";
import type { SignInFormActionResult } from "@/features/auth/actions/signInForm";
import type { AnyFormApi } from "@tanstack/react-form";
import type { Route } from "next";

// constants
const FORM_NAME = "[SIGN IN]";
const SUCCEEDED_MESSAGE = "You signed in successfully.";

// Provide feedback to the user regarding this form actions
export default function useSignInFormFeedback(
  hasPressedSubmitRef: RefObject<boolean>,
  { actionStatus, actionError, errors }: SignInFormActionResult,
  reset: () => void,
  formStore: AnyFormApi["store"],
  redirectTo?: Route,
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

      // Redirect the user after successful sign in
      return setTimeout(() => redirect(redirectTo ?? "/dashboard"), 3000);
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

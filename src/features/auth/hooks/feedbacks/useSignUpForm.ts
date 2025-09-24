// react
import { useEffect } from "react";

// next
import { useRouter } from "next/navigation";

// services, features, and other libraries
import usePermanentMessageFeedback from "@/hooks/feedbacks/usePermanentMessage";
import useFormToastFeedback from "@/hooks/feedbacks/useFormToast";

// types
import type { SignUpFormActionResult } from "@/features/auth/actions/signUpForm";
import type { AnyFormApi } from "@tanstack/react-form";

// constants
const FORM_NAME = "[SIGN UP]";
const SUCCEEDED_MESSAGE = "You signed up successfully.";

// Provide feedback to the user regarding this form actions
export default function useSignUpFormFeedback(
  { actionStatus, actionError, errors }: SignUpFormActionResult,
  reset: () => void,
  formStore: AnyFormApi["store"],
) {
  // To be able to redirect the user after a successful sign up
  const router = useRouter();

  // Generic hook for managing a permanent feedback message
  const { feedbackMessage, showFeedbackMessage, hideFeedbackMessage } = usePermanentMessageFeedback(formStore);

  // Generic hook for displaying toast notifications for form actions
  const showToast = useFormToastFeedback(FORM_NAME, { succeeded: SUCCEEDED_MESSAGE, authError: actionError });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (actionStatus === "succeeded") {
      // Display a success message
      showToast("succeeded");

      // Reset the entire form after successful submission
      reset();

      // Show the permanent feedback message as well
      showFeedbackMessage(SUCCEEDED_MESSAGE);

      // Redirect the user after successful sign up
      timeoutId = setTimeout(() => router.push("/dashboard"), 3000);
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

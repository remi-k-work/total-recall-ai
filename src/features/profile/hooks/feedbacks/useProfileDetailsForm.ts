// react
import { useCallback, useEffect, useState } from "react";

// services, features, and other libraries
import { authClient } from "@/services/better-auth/auth-client";
import { useStore } from "@tanstack/react-form";

// components
import { toast } from "sonner";

// types
import type { ProfileDetailsFormActionResult } from "@/features/profile/actions/profileDetailsForm";
import type { AnyFormApi } from "@tanstack/react-form";

// Provide feedback to the user regarding this form actions
export default function useProfileDetailsFormFeedback(
  { actionStatus, actionError, errors }: ProfileDetailsFormActionResult,
  reset: () => void,
  formStore: AnyFormApi["store"],
) {
  // The permanent feedback message that will be displayed and hung around
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Access the user session data from the client side
  const { refetch } = authClient.useSession();

  // Access the form reactive values from its store
  const isSubmitting = useStore(formStore, (state) => state.isSubmitting);
  const isDefaultValue = useStore(formStore, (state) => state.isDefaultValue);

  useEffect(() => {
    // Clear the permanent feedback message when the user interacts with the form
    if (isSubmitting || !isDefaultValue) setFeedbackMessage("");
  }, [isSubmitting, isDefaultValue]);

  useEffect(() => {
    if (actionStatus === "succeeded") {
      // Display a success message
      toast.success("SUCCESS!", { description: "Your profile details have been updated." });

      // Reset the entire form after successful submission
      reset();

      // Refetch the user session data with the modified changes
      refetch();

      // Set the permanent feedback message as well
      setFeedbackMessage("Your profile details have been updated.");
    } else if (actionStatus === "invalid") {
      toast.warning("MISSING FIELDS!", { description: "Please correct the [PROFILE DETAILS] form fields and try again." });
    } else if (actionStatus === "failed") {
      toast.error("SERVER ERROR!", { description: "The [PROFILE DETAILS] form was not submitted successfully; please try again later." });
    } else if (actionStatus === "authError") {
      toast.error("AUTHORIZATION ERROR!", { description: actionError });
    }
  }, [actionStatus, actionError, errors, reset, refetch]);

  // Clear the permanent feedback message
  const clearFeedbackMessage = useCallback(() => setFeedbackMessage(""), []);

  return { feedbackMessage, clearFeedbackMessage };
}

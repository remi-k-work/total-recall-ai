// react
import { useEffect, useEffectEvent } from "react";

// services, features, and other libraries
import usePermanentMessageFeedbackLoc from "./usePermanentMessageLoc";
import { useStore } from "@tanstack/react-form";

// types
import type { AnyFormApi } from "@tanstack/react-form";

// Generic hook for managing a permanent feedback message (form-aware hook)
export default function usePermanentMessageFeedback(formStore: AnyFormApi["store"]) {
  // Generic hook for managing a permanent feedback message (local-only hook)
  const { feedbackMessage, showFeedbackMessage, hideFeedbackMessage } = usePermanentMessageFeedbackLoc();

  // Access the form reactive values from its store
  const isSubmitting = useStore(formStore, (state) => state.isSubmitting);
  const isDefaultValue = useStore(formStore, (state) => state.isDefaultValue);

  // Function to be called when the user interacted with the form
  const onUserInteracted = useEffectEvent(() => {
    hideFeedbackMessage();
  });

  useEffect(() => {
    // Clear the permanent feedback message when the user interacts with the form
    if (isSubmitting || !isDefaultValue) onUserInteracted();
  }, [isSubmitting, isDefaultValue]);

  return { feedbackMessage, showFeedbackMessage, hideFeedbackMessage };
}

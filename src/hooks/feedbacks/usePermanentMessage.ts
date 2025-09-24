// react
import { useCallback, useEffect, useState } from "react";

// services, features, and other libraries
import { useStore } from "@tanstack/react-form";

// types
import type { AnyFormApi } from "@tanstack/react-form";

// Generic hook for managing a permanent feedback message
export default function usePermanentMessageFeedback(formStore: AnyFormApi["store"]) {
  // The permanent feedback message that will be displayed and hung around
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Access the form reactive values from its store
  const isSubmitting = useStore(formStore, (state) => state.isSubmitting);
  const isDefaultValue = useStore(formStore, (state) => state.isDefaultValue);

  useEffect(() => {
    // Clear the permanent feedback message when the user interacts with the form
    if (isSubmitting || !isDefaultValue) setFeedbackMessage("");
  }, [isSubmitting, isDefaultValue]);

  // Functions to either show or hide the permanent feedback message
  const showFeedbackMessage = useCallback((message: string) => setFeedbackMessage(message), []);
  const hideFeedbackMessage = useCallback(() => setFeedbackMessage(""), []);

  return { feedbackMessage, showFeedbackMessage, hideFeedbackMessage };
}

// react
import { useCallback, useState } from "react";

// Generic hook for managing a permanent feedback message (local-only hook)
export default function usePermanentMessageFeedbackLoc() {
  // The permanent feedback message that will be displayed and hung around
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Functions to either show or hide the permanent feedback message
  const showFeedbackMessage = useCallback((message: string) => setFeedbackMessage(message), []);
  const hideFeedbackMessage = useCallback(() => setFeedbackMessage(""), []);

  return { feedbackMessage, showFeedbackMessage, hideFeedbackMessage };
}

// react
import { useCallback } from "react";

// services, features, and other libraries
import { useDemoModeContext } from "@/contexts/DemoMode";

// Custom hook that observes an action's status and automatically opens the global demo mode modal
export default function useDemoModeGuard(actionStatus: string) {
  // Access the demo mode context and retrieve all necessary information
  const { openDemoMode } = useDemoModeContext();

  // Was a restricted operation attempted under the demo account? Inform the user
  const guardForDemoMode = useCallback(() => {
    if (actionStatus === "demoMode") openDemoMode();
  }, [actionStatus, openDemoMode]);

  return guardForDemoMode;
}

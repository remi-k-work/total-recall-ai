"use client";

// react
import { createContext, use, useState, useCallback } from "react";

// components
import DemoModeModal from "@/components/demo-mode-modal";

// types
import type { ReactNode } from "react";

interface DemoModeContextType {
  openDemoMode: () => void;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

export function useDemoModeContext() {
  const ctx = use(DemoModeContext);
  if (!ctx) throw new Error("useDemoModeContext must be used within a DemoModeProvider.");
  return ctx;
}

export default function DemoModeProvider({ children }: { children: ReactNode }) {
  // Whether or not the demo mode modal is open
  const [isOpen, setIsOpen] = useState(false);

  // This function opens the demo mode modal
  const openDemoMode = useCallback(() => setIsOpen(true), []);

  return (
    <DemoModeContext value={{ openDemoMode }}>
      {children}
      {isOpen && <DemoModeModal onClosed={() => setIsOpen(false)} />}
    </DemoModeContext>
  );
}

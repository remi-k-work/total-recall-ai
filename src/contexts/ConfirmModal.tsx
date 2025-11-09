"use client";

// react
import { createContext, use, useState, useCallback, useRef } from "react";

// components
import ConfirmModal from "@/components/ConfirmModal2";

// types
import type { ReactNode, RefObject } from "react";

interface ConfirmModalContextType {
  hasPressedConfirmRef: RefObject<boolean>;
  openConfirmModal: (content: ReactNode, onConfirmed: () => void) => void;
}

const ConfirmModalContext = createContext<ConfirmModalContextType | undefined>(undefined);

export function useConfirmModalContext() {
  const ctx = use(ConfirmModalContext);
  if (!ctx) throw new Error("useConfirmModalContext must be used within a ConfirmModalProvider.");
  return ctx;
}

export default function ConfirmModalProvider({ children }: { children: ReactNode }) {
  // Whether or not the confirm modal is open
  const [isOpen, setIsOpen] = useState(false);

  const contentRef = useRef<ReactNode>(undefined);
  const onConfirmedRef = useRef<() => void>(undefined);

  // Track if the user has pressed the confirm button
  const hasPressedConfirmRef = useRef(false);

  // This function opens the confirm modal
  const openConfirmModal = useCallback((content: ReactNode, onConfirmed: () => void) => {
    contentRef.current = content;
    onConfirmedRef.current = onConfirmed;
    setIsOpen(true);
  }, []);

  return (
    <ConfirmModalContext value={{ hasPressedConfirmRef, openConfirmModal }}>
      {children}
      {isOpen && (
        <ConfirmModal
          hasPressedConfirmRef={hasPressedConfirmRef}
          onConfirmed={() => {
            onConfirmedRef.current?.();
          }}
          onClosed={() => setIsOpen(false)}
        >
          {contentRef.current}
        </ConfirmModal>
      )}
    </ConfirmModalContext>
  );
}

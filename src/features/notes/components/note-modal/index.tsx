"use client";

// react
import { useEffect, useRef, useState } from "react";

// next
import { useRouter } from "next/navigation";

// services, features, and other libraries
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

// components
import Header from "./Header";
import Content from "./Content";

// types
import type { ComponentPropsWithoutRef } from "react";
import type { ReactNode } from "react";

interface NoteModalProps extends ComponentPropsWithoutRef<"dialog"> {
  icon: ReactNode;
  title: string;
  browseBar: ReactNode;
  children: ReactNode;
}

export default function NoteModal({ icon, title, browseBar, children, className, ...props }: NoteModalProps) {
  // To be able to call showModal() method on the dialog
  const dialogRef = useRef<HTMLDialogElement>(null);

  // To be able to close the modal
  const { back } = useRouter();

  // This allows AnimatePresence to detect when the component should exit
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // Display the dialog as a non-modal this time, since the modal interferes with our toast notifications
    dialogRef.current?.show();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        "text-foreground fixed inset-0 z-50 grid size-full max-h-none max-w-none place-items-center overflow-hidden overscroll-contain bg-transparent backdrop-sepia transition-all transition-discrete duration-1000 ease-in-out",
        "not-open:pointer-events-none not-open:invisible not-open:opacity-0 open:pointer-events-auto open:visible open:opacity-100 focus-visible:outline-none",
        className,
      )}
      // When the dialog is actually closed (by .close() or ESC), it calls the parent's onClosed handler
      onClose={() => back()}
      {...props}
    >
      {/* The onExitComplete callback is crucial. It calls dialog.close() ONLY after the exit animation is done */}
      <AnimatePresence onExitComplete={() => dialogRef.current?.close()}>
        {isOpen && (
          <motion.div
            className="bg-background grid max-h-[min(95dvb,100%)] max-w-[min(96ch,100%)] grid-rows-[auto_1fr] items-start overflow-hidden"
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.75 }}
            transition={{ ease: "easeOut", duration: 0.5 }}
          >
            <Header icon={icon} title={title} onClosed={() => setIsOpen(false)} />
            <Content>
              {browseBar}
              {children}
            </Content>
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );
}

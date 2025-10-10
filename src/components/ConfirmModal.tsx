// react
import { useEffect, useRef, useState } from "react";

// services, features, and other libraries
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

// components
import { Button } from "@/components/ui/custom/button";

// assets
import { HandThumbDownIcon, HandThumbUpIcon, QuestionMarkCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

// types
import type { ComponentPropsWithoutRef } from "react";

interface ConfirmModalProps extends ComponentPropsWithoutRef<"dialog"> {
  onConfirmed: () => void;
  onClosed: () => void;
}

export default function ConfirmModal({ onConfirmed, onClosed, children, className, ...props }: ConfirmModalProps) {
  // To be able to call showModal() method on the dialog
  const dialogRef = useRef<HTMLDialogElement>(null);

  // This allows AnimatePresence to detect when the component should exit
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // Show the dialog as a modal
    dialogRef.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        "text-foreground fixed inset-0 z-50 grid size-full max-h-none max-w-none place-items-center overflow-hidden overscroll-contain bg-transparent transition-all transition-discrete duration-1000 ease-in-out",
        "not-open:pointer-events-none not-open:invisible not-open:opacity-0 open:pointer-events-auto open:visible open:opacity-100 focus-visible:outline-none",
        "backdrop:backdrop-blur-xl backdrop:[transition:backdrop-filter_1s_ease]",
        className,
      )}
      // When the dialog is actually closed (by .close() or ESC), it calls the parent's onClosed handler
      onClose={onClosed}
      {...props}
    >
      {/* The onExitComplete callback is crucial. It calls dialog.close() ONLY after the exit animation is done */}
      <AnimatePresence onExitComplete={() => dialogRef.current?.close()}>
        {isOpen && (
          <motion.div
            className="bg-background grid max-h-[min(95dvb,100%)] max-w-[min(96ch,100%)] grid-rows-[auto_1fr_auto] items-start overflow-hidden"
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.75 }}
            transition={{ ease: "easeOut", duration: 0.5 }}
          >
            <header className="from-primary to-secondary flex items-center justify-between gap-4 bg-linear-to-r p-3">
              <section className="flex items-center gap-2">
                <QuestionMarkCircleIcon className="size-11 flex-none" />
                <h4 className="flex-1 font-sans text-3xl leading-none uppercase">Please Confirm!</h4>
              </section>
              <Button type="button" size="icon" onClick={() => setIsOpen(false)}>
                <XCircleIcon className="size-11" />
              </Button>
            </header>
            <article className="z-1 grid max-h-full overflow-y-auto overscroll-y-contain px-6 py-9">{children}</article>
            <footer className="flex flex-wrap items-center gap-6 border-t p-3 *:flex-1">
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  onConfirmed();
                  setIsOpen(false);
                }}
              >
                <HandThumbUpIcon className="size-9" />
                Confirm
              </Button>
              <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
                <HandThumbDownIcon className="size-9" />
                Cancel
              </Button>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  );
}

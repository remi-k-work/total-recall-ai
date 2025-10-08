// react
import { useEffect, useRef } from "react";

// services, features, and other libraries
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";

// components
import { Button } from "@/components/ui/custom/button";
import Messages from "./Messages";
import Footer from "./Footer";

// assets
import { SparklesIcon, XCircleIcon } from "@heroicons/react/24/outline";

// types
interface ModalProps {
  onClosed: () => void;
}

export default function Modal({ onClosed }: ModalProps) {
  // To be able to call showModal() method on the dialog
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    // Show the dialog as a modal
    dialogRef.current?.showModal();
  }, []);

  const { messages, sendMessage, status } = useChat();

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        "text-foreground fixed inset-0 z-50 grid size-full max-h-none max-w-none place-items-center overflow-hidden overscroll-contain bg-transparent transition-all transition-discrete duration-1000 ease-in-out",
        "not-open:pointer-events-none not-open:invisible not-open:opacity-0 open:pointer-events-auto open:visible open:opacity-100 focus-visible:outline-none",
        "backdrop:backdrop-blur-xl backdrop:[transition:backdrop-filter_1s_ease]",
      )}
      onClose={onClosed}
    >
      <form method="dialog" className="bg-background grid max-h-[min(95dvb,100%)] max-w-[min(96ch,100%)] grid-rows-[auto_1fr_auto] items-start overflow-hidden">
        <header className="flex items-center justify-between gap-4 p-1">
          <section className="flex items-center gap-2">
            <SparklesIcon className="size-11 flex-none" />
            <h3 className="flex-1 font-sans text-3xl leading-none uppercase">Notes Assistant</h3>
          </section>
          <Button type="submit" size="icon" variant="ghost">
            <XCircleIcon className="size-11" />
          </Button>
        </header>
        <Messages messages={messages} />
        <Footer sendMessage={sendMessage} status={status} />
      </form>
    </dialog>
  );
}

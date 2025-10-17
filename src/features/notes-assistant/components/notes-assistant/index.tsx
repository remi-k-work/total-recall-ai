"use client";

// react
import { useState } from "react";

// components
import { Button } from "@/components/ui/custom/button";
import Modal from "./Modal";

// assets
import { SparklesIcon } from "@heroicons/react/24/outline";

export default function NotesAssistant() {
  // Whether or not the modal is open
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button type="button" size="icon" variant="ghost" title="Notes Assistant" onClick={() => setIsOpen(true)}>
        <SparklesIcon className="size-11" />
      </Button>
      {isOpen && <Modal onClosed={() => setIsOpen(false)} />}
    </>
  );
}

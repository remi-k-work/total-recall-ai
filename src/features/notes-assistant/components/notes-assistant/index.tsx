"use client";

// react
import { useState } from "react";

// components
import { Button } from "@/components/ui/custom/button";
import Modal from "./Modal";

// assets
import { SparklesIcon } from "@heroicons/react/24/outline";

// types
import type { Session, User } from "@/services/better-auth/auth";

interface NotesAssistantProps {
  user: User;
  session: Session;
}

export default function NotesAssistant({ user, session }: NotesAssistantProps) {
  // Whether or not the modal is open
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button type="button" size="icon" variant="ghost" title="Notes Assistant" onClick={() => setIsOpen(true)}>
        <SparklesIcon className="size-11" />
      </Button>
      {isOpen && <Modal user={user} session={session} onClosed={() => setIsOpen(false)} />}
    </>
  );
}

export function NotesAssistantSkeleton() {
  return (
    <Button type="button" size="icon" variant="ghost" title="Notes Assistant" disabled>
      <SparklesIcon className="size-11" />
    </Button>
  );
}

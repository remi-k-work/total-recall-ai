"use client";

// services, features, and other libraries
import { useNotesAssistantModal } from "@/atoms";

// components
import { Button } from "@/components/ui/custom/button";

// assets
import { SparklesIcon } from "@heroicons/react/24/outline";

export default function NotesAssistant() {
  // This is the hook that components use to open the modal
  const { openNotesAssistantModal } = useNotesAssistantModal();

  return (
    <Button type="button" size="icon" variant="ghost" title="Notes Assistant" onClick={openNotesAssistantModal}>
      <SparklesIcon className="size-11" />
    </Button>
  );
}

export function NotesAssistantSkeleton() {
  return (
    <Button type="button" size="icon" variant="ghost" title="Notes Assistant" disabled>
      <SparklesIcon className="size-11" />
    </Button>
  );
}

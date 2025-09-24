// services, features, and other libraries
import { cn } from "@/lib/utils";

// assets
import { InformationCircleIcon } from "@heroicons/react/24/outline";

// types
interface InfoLineProps {
  message: string;
}

export default function InfoLine({ message }: InfoLineProps) {
  return (
    <p
      role="status"
      aria-live="polite"
      className={cn("text-muted-foreground border-input mx-6 mb-4 flex max-w-none items-center gap-2 border px-3 py-2", "animate-valid-error-show")}
    >
      <InformationCircleIcon className="size-9 flex-none" />
      {message}
    </p>
  );
}

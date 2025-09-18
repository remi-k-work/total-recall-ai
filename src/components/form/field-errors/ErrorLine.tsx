// services, features, and other libraries
import { cn } from "@/lib/utils";

// assets
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

// types
interface ErrorLineProps {
  isShowing: boolean;
  message: string;
}

export function ErrorLine({ isShowing, message }: ErrorLineProps) {
  return (
    <p
      role="alert"
      className={cn(
        "text-destructive-foreground bg-destructive border-input flex max-w-none items-center gap-2 border px-3 py-2",
        isShowing ? "animate-valid-error-show" : "animate-valid-error-hide",
      )}
    >
      <ExclamationTriangleIcon className="size-9 flex-none" />
      {message}
    </p>
  );
}

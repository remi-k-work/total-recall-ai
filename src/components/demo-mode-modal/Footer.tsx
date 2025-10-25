// components
import { Button } from "@/components/ui/custom/button";
import SignInOrCreate from "./SignInOrCreate";

// assets
import { XCircleIcon } from "@heroicons/react/24/outline";

// types
interface FooterProps {
  onClosed: () => void;
}

export default function Footer({ onClosed }: FooterProps) {
  return (
    <footer className="flex flex-wrap items-center gap-6 border-t p-3 *:flex-1">
      <SignInOrCreate onSignedOut={onClosed} />
      <Button type="button" variant="secondary" onClick={onClosed}>
        <XCircleIcon className="size-9" />
        Continue Demo
      </Button>
    </footer>
  );
}

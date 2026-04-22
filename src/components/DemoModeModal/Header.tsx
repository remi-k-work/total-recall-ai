// components
import { Button } from "@/components/ui/custom/button";

// assets
import { ShieldExclamationIcon, XCircleIcon } from "@heroicons/react/24/outline";

// types
interface HeaderProps {
  onClosed: () => void;
}

export default function Header({ onClosed }: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 bg-linear-to-r from-primary to-secondary p-3">
      <section className="flex items-center gap-2">
        <ShieldExclamationIcon className="size-11 flex-none" />
        <h4 className="flex-1 font-sans text-3xl leading-none uppercase">Welcome to Demo Mode!</h4>
      </section>
      <Button type="button" size="icon" onClick={onClosed}>
        <XCircleIcon className="size-11" />
      </Button>
    </header>
  );
}

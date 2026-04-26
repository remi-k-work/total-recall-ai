// components
import { Button } from "@/components/ui/custom/button";

// assets
import { SparklesIcon, XCircleIcon } from "@heroicons/react/24/outline";

// types
interface HeaderProps {
  onClosed: () => void;
}

export default function Header({ onClosed }: HeaderProps) {
  return (
    <header className="from-primary to-secondary flex items-center justify-between gap-4 bg-linear-to-r p-3">
      <section className="flex items-center gap-2">
        <SparklesIcon className="size-11 flex-none" />
        <h4 className="flex-1 font-sans text-3xl leading-none uppercase">Notes Assistant</h4>
      </section>
      <Button type="button" size="icon" onClick={onClosed}>
        <XCircleIcon className="size-11" />
      </Button>
    </header>
  );
}

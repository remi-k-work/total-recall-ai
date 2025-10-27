// components
import { Button } from "@/components/ui/custom/button";

// assets
import { XCircleIcon } from "@heroicons/react/24/outline";

// types
import type { ReactNode } from "react";

interface HeaderProps {
  icon: ReactNode;
  title: string;
  onClosed: () => void;
}

export default function Header({ icon, title, onClosed }: HeaderProps) {
  return (
    <header className="from-primary to-secondary flex items-center justify-between gap-4 bg-linear-to-r p-3">
      <section className="flex items-center gap-2">
        {icon}
        <h4 className="flex-1 font-sans text-3xl leading-none uppercase">{title}</h4>
      </section>
      <Button type="button" size="icon" onClick={onClosed}>
        <XCircleIcon className="size-11" />
      </Button>
    </header>
  );
}

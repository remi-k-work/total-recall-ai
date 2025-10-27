// types
import type { ReactNode } from "react";

interface ContentProps {
  children: ReactNode;
}

export default function Content({ children }: ContentProps) {
  return <article className="z-1 grid max-h-full overflow-y-auto overscroll-y-contain">{children}</article>;
}

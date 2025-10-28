"use client";

// services, features, and other libraries
import { cn } from "@/lib/utils";
import useTypeWriter from "@/hooks/useTypeWriter";

// types
interface TypeWriterOutputProps {
  fullText: string;
}

export default function TypeWriterOutput({ fullText }: TypeWriterOutputProps) {
  const { elementRef, isRunning } = useTypeWriter(fullText);

  return (
    <>
      <p className="sr-only">{fullText}</p>
      <p
        ref={elementRef}
        className={cn(
          "dark:text-background h-64 max-w-none overflow-y-auto px-6 text-wrap sm:text-xl",
          isRunning && "after:animate-cursor-blink after:content-['▋']",
        )}
      />
    </>
  );
}

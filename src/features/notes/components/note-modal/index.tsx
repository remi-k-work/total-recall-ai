"use client";

// react
import { useEffect, useRef } from "react";

// next
import { useRouter } from "next/navigation";

// services, features, and other libraries
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

// components
import Header from "./Header";
import Content from "./Content";

// types
import type { ComponentPropsWithoutRef } from "react";
import type { ReactNode } from "react";
import type { getNoteTitle } from "@/features/notes/db";

interface NoteModalProps extends ComponentPropsWithoutRef<"dialog"> {
  icon: ReactNode;
  browseBar: ReactNode;
  noteId?: string;
  children: ReactNode;
}

// constants
const CLOSE_DURATION = 1000;

export default function NoteModal({ icon, browseBar, noteId, children, className, ...props }: NoteModalProps) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["note", "title", noteId],
    queryFn: async ({ signal }): Promise<Awaited<ReturnType<typeof getNoteTitle>>> => {
      const res = await fetch(`/api/notes/${noteId}?title=true`, { credentials: "include", signal });
      if (!res.ok) throw new Error(res.statusText);
      return await res.json();
    },
    enabled: !!noteId,
  });

  // To be able to call showModal() method on the dialog
  const dialogRef = useRef<HTMLDialogElement>(null);

  // To be able to close the modal
  const { back } = useRouter();

  // Create a ref to hold the timeout id
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Display the dialog as a non-modal this time, since the modal interferes with our toast notifications
    if (isLoading || isError) return;
    dialogRef.current?.show();

    // The cleanup function runs when the component unmounts
    return () => {
      // If a timeout is scheduled, clear it
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    };
  }, [isLoading, isError]);

  function handleClosed() {
    // Wait for animation to complete before navigating back
    timeoutIdRef.current = setTimeout(() => back(), CLOSE_DURATION);
  }

  if (isError) console.error(error);
  if (isLoading || isError) return null;

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        "text-foreground fixed inset-0 z-50 grid size-full max-h-none max-w-none place-items-center overflow-hidden overscroll-contain bg-transparent backdrop-sepia transition-all transition-discrete duration-1000 ease-in-out",
        "not-open:pointer-events-none not-open:invisible not-open:opacity-0 open:pointer-events-auto open:visible open:opacity-100 focus-visible:outline-none",
        className,
      )}
      onClose={handleClosed}
      {...props}
    >
      <div className="bg-background grid max-h-[min(95dvb,100%)] max-w-[min(96ch,100%)] grid-rows-[auto_1fr] items-start overflow-hidden">
        <Header icon={icon} title={data?.title ?? "New Note"} onClosed={() => dialogRef.current?.close()} />
        <Content>
          {browseBar}
          {children}
        </Content>
      </div>
    </dialog>
  );
}

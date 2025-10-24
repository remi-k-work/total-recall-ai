import { cn } from "@/lib/utils";
import type { UIMessage } from "ai";
import type { ComponentPropsWithoutRef } from "react";

type MessageProps = ComponentPropsWithoutRef<"div"> & { from: UIMessage["role"] };
type MessageContentProps = ComponentPropsWithoutRef<"div">;

export const Message = ({ className, from, ...props }: MessageProps) => (
  <div
    className={cn("group flex w-full items-end justify-end gap-2 py-4", from === "user" ? "is-user" : "is-assistant flex-row-reverse", className)}
    {...props}
  />
);

export const MessageContent = ({ className, ...props }: MessageContentProps) => (
  <div
    className={cn(
      "flex max-w-[80%] flex-col gap-2 overflow-hidden rounded-lg px-4 py-3",
      "group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground",
      "group-[.is-assistant]:bg-secondary group-[.is-assistant]:text-foreground",
      className,
    )}
    {...props}
  />
);

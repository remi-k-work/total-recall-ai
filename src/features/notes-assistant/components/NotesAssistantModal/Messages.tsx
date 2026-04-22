// services, features, and other libraries
import { useStickToBottom } from "use-stick-to-bottom";

// components
import Message from "./Message";
import { Button } from "@/components/ui/custom/button";

// assets
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

// types
import type { UIMessage, useChat } from "@ai-sdk/react";
import type { Session, User } from "@/services/better-auth/auth";

interface MessagesProps {
  user: User;
  session: Session;
  messages: UIMessage[];
  status: ReturnType<typeof useChat>["status"];
  error: ReturnType<typeof useChat>["error"];
  regenerate: ReturnType<typeof useChat>["regenerate"];
}

export default function Messages({ user, session, messages, status, error, regenerate }: MessagesProps) {
  const { scrollRef, contentRef } = useStickToBottom();

  return (
    <article ref={scrollRef} className="z-1 flex max-h-full flex-col overflow-y-auto overscroll-y-contain px-3 py-6">
      <div ref={contentRef}>
        {messages.map((message) => (
          <Message key={message.id} user={user} session={session} message={message} status={status} />
        ))}

        {error && (
          <section className="flex items-center gap-2 border border-input bg-destructive px-3 py-2 text-destructive-foreground">
            <ExclamationTriangleIcon className="size-11 flex-none" />
            <p className="flex-1">Our support agents are currently overwhelmed or out of office. Please try again later.</p>
            <Button
              type="button"
              size="icon"
              disabled={!(status === "ready" || status === "error")}
              title="Try Again"
              onClick={() => regenerate()}
              className="flex-none"
            >
              <ArrowPathIcon className="size-9" />
            </Button>
          </section>
        )}
      </div>
    </article>
  );
}

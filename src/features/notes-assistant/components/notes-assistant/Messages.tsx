// services, features, and other libraries
import { useStickToBottom } from "use-stick-to-bottom";

// components
import Message from "./Message";

// types
import type { UIMessage, useChat } from "@ai-sdk/react";
import type { Session, User } from "@/services/better-auth/auth";

interface MessagesProps {
  messages: UIMessage[];
  status: ReturnType<typeof useChat>["status"];
  user: User;
  session: Session;
}

export default function Messages({ messages, status, user, session }: MessagesProps) {
  const { scrollRef, contentRef } = useStickToBottom();

  return (
    <article ref={scrollRef} className="z-1 flex max-h-full flex-col overflow-y-auto overscroll-y-contain px-3 py-6">
      <div ref={contentRef}>
        {messages.map((message) => (
          <Message key={message.id} message={message} status={status} user={user} session={session} />
        ))}
      </div>
    </article>
  );
}

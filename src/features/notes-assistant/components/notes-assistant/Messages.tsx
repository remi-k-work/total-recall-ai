// components
import Message from "./Message";

// types
import type { UIMessage } from "@ai-sdk/react";

interface MessagesProps {
  messages: UIMessage[];
}

export default function Messages({ messages }: MessagesProps) {
  return (
    <section className="z-1 grid max-h-full gap-3 overflow-y-auto overscroll-y-contain px-3 py-6">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </section>
  );
}

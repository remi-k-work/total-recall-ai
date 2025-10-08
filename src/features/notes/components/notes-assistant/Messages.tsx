// types
import type { useChat } from "@ai-sdk/react";

interface MessagesProps {
  messages: ReturnType<typeof useChat>["messages"];
}

export default function Messages({ messages }: MessagesProps) {
  return (
    <article className="z-1 grid max-h-full overflow-y-auto overscroll-y-contain p-4">
      {messages.map((message) => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === "user" ? "User: " : "AI: "}
          {message.parts.map((part, i) => {
            switch (part.type) {
              case "text":
                return <div key={`${message.id}-${i}`}>{part.text}</div>;
            }
          })}
        </div>
      ))}
    </article>
  );
}

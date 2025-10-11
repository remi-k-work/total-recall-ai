// services, features, and other libraries
import { cn } from "@/lib/utils";

// components
import ReactMarkdown from "react-markdown";

// types
import type { UIMessage } from "@ai-sdk/react";

interface MessageProps {
  message: UIMessage;
}

export default function Message({ message: { id, role, parts } }: MessageProps) {
  return (
    <article
      className={cn(
        "prose dark:prose-invert rounded-lg px-3 py-2",
        role === "user" ? "bg-primary text-primary-foreground whitespace-pre-wrap" : "bg-secondary text-secondary-foreground",
      )}
    >
      {parts.map((part, index) => {
        switch (part.type) {
          // Render text parts as markdown
          case "text":
            return <ReactMarkdown key={`${id}-${index}`}>{part.text}</ReactMarkdown>;

          // For tool parts, use the typed tool part names
          case "tool-searchNoteChunksForUser":
            const callId = part.toolCallId;

            return (
              <p key={callId} className="animate-pulse italic">
                Searching Notes...
              </p>
            );
        }
      })}
    </article>
  );
}

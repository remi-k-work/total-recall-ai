// components
import { Message as AIEMessage, MessageAvatar, MessageContent } from "@/components/ai-elements/custom/message";
import { Response } from "@/components/ai-elements/response";

// types
import type { UIMessage, useChat } from "@ai-sdk/react";

interface MessageProps {
  message: UIMessage;
  status: ReturnType<typeof useChat>["status"];
}

// constants
import { REHYPE_PLUGINS } from "@/features/notes-assistant/constants/plugins";

export default function Message({ message: { id, role, parts }, status }: MessageProps) {
  return (
    <AIEMessage from={role}>
      <MessageContent>
        {parts.map((part, index) => {
          switch (part.type) {
            // Render text parts as markdown
            case "text":
              return (
                <Response key={`${id}-${index}`} rehypePlugins={REHYPE_PLUGINS} isAnimating={status === "streaming"}>
                  {part.text}
                </Response>
              );

            // For tool parts, use the typed tool part names
            case "tool-searchNoteChunksForUser":
              const callId = part.toolCallId;

              return (
                <p key={callId} className="animate-pulse italic">
                  Searching Notes...
                </p>
              );

            default:
              return null;
          }
        })}
      </MessageContent>
      <MessageAvatar name="Total Recall" avatar="/logo-oauth-google.png" />
    </AIEMessage>
  );
}

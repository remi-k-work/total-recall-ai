// components
import { Message as AIEMessage, MessageContent, MessageResponse } from "@/components/ai-elements/custom/message";
import { UserAvatarSm } from "@/components/Avatar/User";
import AgentAvatar from "@/components/Avatar/Agent";

// types
import type { useChat } from "@ai-sdk/react";
import type { Session, User } from "@/services/better-auth/auth";
import type { NotesAssistantUIMessage } from "@/features/notesAssistant/lib/agent";

interface MessageProps {
  user: User;
  session: Session;
  message: NotesAssistantUIMessage;
  status: ReturnType<typeof useChat<NotesAssistantUIMessage>>["status"];
}

export default function Message({ user, session, message: { id, role, parts }, status }: MessageProps) {
  return (
    <AIEMessage from={role}>
      <MessageContent>
        {parts.map((part, index) => {
          switch (part.type) {
            // Render text parts as markdown
            case "text":
              return (
                <MessageResponse key={`${id}-${index}`} isAnimating={status === "streaming"}>
                  {part.text}
                </MessageResponse>
              );

            // For tool parts, use the typed tool part names
            case "tool-getInformation":
              const { toolCallId } = part;

              return (
                <p key={toolCallId} className="italic">
                  Searching Notes...
                </p>
              );

            default:
              return null;
          }
        })}
      </MessageContent>
      {role === "user" ? <UserAvatarSm user={user} session={session} /> : <AgentAvatar isSmall />}
    </AIEMessage>
  );
}

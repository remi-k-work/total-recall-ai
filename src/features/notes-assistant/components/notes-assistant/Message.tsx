// components
import { Message as AIEMessage, MessageContent } from "@/components/ai-elements/custom/message";
import { Response } from "@/components/ai-elements/response";
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from "@/components/ai-elements/custom/tool";
import UserAvatar from "@/components/avatar/user";
import AgentAvatar from "@/components/avatar/Agent";

// types
import type { UIMessage, useChat } from "@ai-sdk/react";
import type { Session, User } from "@/services/better-auth/auth";

interface MessageProps {
  message: UIMessage;
  status: ReturnType<typeof useChat>["status"];
  user: User;
  session: Session;
}

// constants
import { REHYPE_PLUGINS } from "@/features/notes-assistant/constants/plugins";

export default function Message({ message: { id, role, parts }, status, user, session }: MessageProps) {
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
              const { toolCallId, state, input, output, errorText } = part;

              return (
                <Tool key={toolCallId}>
                  <ToolHeader title="Searching Notes" type={part.type} state={state} />
                  <ToolContent>
                    <ToolInput input={input} />
                    <ToolOutput output={output} errorText={errorText} />
                  </ToolContent>
                </Tool>
                // <p key={callId} className="animate-pulse italic">
                //   Searching Notes...
                // </p>
              );

            default:
              return null;
          }
        })}
      </MessageContent>
      {role === "user" ? <UserAvatar user={user} session={session} isSmall /> : <AgentAvatar isSmall />}
    </AIEMessage>
  );
}

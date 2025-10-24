// services, features, and other libraries
import { authClient } from "@/services/better-auth/auth-client";

// components
import { Message as AIEMessage, MessageContent } from "@/components/ai-elements/custom/message";
import { Response } from "@/components/ai-elements/response";
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from "@/components/ai-elements/custom/tool";
import UserAvatar from "@/components/UserAvatar";
import AgentAvatar from "@/components/AgentAvatar";

// types
import type { UIMessage, useChat } from "@ai-sdk/react";

interface MessageProps {
  message: UIMessage;
  status: ReturnType<typeof useChat>["status"];
}

// constants
import { REHYPE_PLUGINS } from "@/features/notes-assistant/constants/plugins";

export default function Message({ message: { id, role, parts }, status }: MessageProps) {
  // Access the user session data from the client side
  const { data: userSessionData } = authClient.useSession();

  // If there is no user session data, do not render anything
  if (!userSessionData) return null;

  // Destructure the user session data
  const {
    user: { name, image, role: userRole },
  } = userSessionData;

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
      {role === "user" ? <UserAvatar isSmall /> : <AgentAvatar isSmall />}
    </AIEMessage>
  );
}

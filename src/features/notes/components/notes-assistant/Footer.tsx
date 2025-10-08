// react
import { useState } from "react";

// components
import { Textarea } from "@/components/ui/custom/textarea";
import { Button } from "@/components/ui/custom/button";

// assets
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

// types
import type { useChat } from "@ai-sdk/react";

interface FooterProps {
  sendMessage: ReturnType<typeof useChat>["sendMessage"];
  status: ReturnType<typeof useChat>["status"];
}

export default function Footer({ sendMessage, status }: FooterProps) {
  const [input, setInput] = useState("");

  const isInputValid = input.trim().length > 0;
  const isProcessing = status === "submitted" || status === "streaming";

  return (
    <footer className="flex gap-2 border-t p-3">
      <Textarea
        value={input}
        onChange={(ev) => setInput(ev.target.value)}
        cols={50}
        rows={4}
        maxLength={1024}
        spellCheck={false}
        autoComplete="off"
        placeholder="Ask me anything about your notes..."
      />
      <Button
        type="button"
        size="icon"
        variant="ghost"
        disabled={!isInputValid || isProcessing}
        title="Send Message"
        onClick={() => {
          if (!isInputValid || isProcessing) return;
          sendMessage({ text: input });
          setInput("");
        }}
      >
        <PaperAirplaneIcon className="size-11" />
      </Button>
    </footer>
  );
}

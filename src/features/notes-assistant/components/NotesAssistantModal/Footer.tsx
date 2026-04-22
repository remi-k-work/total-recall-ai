// react
import { useState } from "react";

// components
import { Textarea } from "@/components/ui/custom/textarea";
import { Button } from "@/components/ui/custom/button";

// assets
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Loader2 } from "lucide-react";

// types
import type { useChat } from "@ai-sdk/react";

interface FooterProps {
  sendMessage: ReturnType<typeof useChat>["sendMessage"];
  status: ReturnType<typeof useChat>["status"];
}

export default function Footer({ sendMessage, status }: FooterProps) {
  const [input, setInput] = useState("");

  // Is the user's input valid?
  const isInputValid = input.trim().length > 0;

  return (
    <footer className="flex gap-3 border-t p-3">
      <Textarea
        value={input}
        onChange={(ev) => setInput(ev.target.value)}
        disabled={status !== "ready"}
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
        disabled={!isInputValid || status !== "ready"}
        title="Send Message"
        onClick={() => {
          sendMessage({ text: input.trim() });
          setInput("");
        }}
      >
        {status === "submitted" || status === "streaming" ? <Loader2 className="size-11 animate-spin" /> : <PaperAirplaneIcon className="size-11" />}
      </Button>
    </footer>
  );
}

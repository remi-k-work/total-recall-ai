// services, features, and other libraries
import { AnimatePresence } from "motion/react";

// components
import ErrorLine from "./ErrorLine";

// types
interface ErrorListProps {
  messages: string[];
}

export default function ErrorList({ messages }: ErrorListProps) {
  return (
    <AnimatePresence>
      {messages.map((message) => (
        <ErrorLine key={message} message={message} />
      ))}
    </AnimatePresence>
  );
}

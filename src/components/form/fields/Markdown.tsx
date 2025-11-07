// services, features, and other libraries
import { useFieldContext } from "@/components/form";

// components
import { MarkdownEditor } from "@/components/markdown-editor";

// types
import type { ComponentProps } from "react";

interface MarkdownFieldProps extends ComponentProps<typeof MarkdownEditor> {}

export default function MarkdownField({ ...props }: MarkdownFieldProps) {
  // Get the field context
  const { handleBlur } = useFieldContext<string>();

  return <MarkdownEditor {...props} onBlur={handleBlur} />;
}

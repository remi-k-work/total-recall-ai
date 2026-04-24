// react
import { useId } from "react";

// services, features, and other libraries
import { useFieldContext } from "@/components/formOld";

// components
import { Label } from "@/components/ui/custom/label";
import { MarkdownEditor } from "@/components/MarkdownEditor";

// types
import type { ComponentProps } from "react";

interface MarkdownFieldProps extends ComponentProps<typeof MarkdownEditor> {
  label: string;
}

export default function MarkdownField({ label, ...props }: MarkdownFieldProps) {
  // Get the field context
  const {
    name,
    state: { value },
    handleBlur,
  } = useFieldContext<string>();

  // Generate a unique id
  const id = useId();

  return (
    <>
      <Label htmlFor={id}>{label}</Label>
      <output id={id} name={name}>
        <MarkdownEditor {...props} markdown={value} onBlur={handleBlur} />
      </output>
    </>
  );
}

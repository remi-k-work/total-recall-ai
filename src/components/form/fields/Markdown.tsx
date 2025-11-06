// services, features, and other libraries
import { useFieldContext } from "@/components/form";

// components
import { Label } from "@/components/ui/custom/label";
import { MarkdownEditor } from "@/components/markdown-editor";
import FieldErrors from "@/components/form/field-errors";

// types
import type { ComponentPropsWithoutRef } from "react";

interface MarkdownFieldProps extends ComponentPropsWithoutRef<typeof MarkdownEditor> {
  label: string;
}

export default function MarkdownField({ label, ...props }: MarkdownFieldProps) {
  // Get the field context
  const {
    state: { value },
    handleChange,
    handleBlur,
  } = useFieldContext<string>();

  return (
    <>
      {/* <Label> */}
      {label}
      <MarkdownEditor {...props} markdown={value} onChange={handleChange} onBlur={handleBlur} />
      {/* </Label> */}
      <FieldErrors />
    </>
  );
}

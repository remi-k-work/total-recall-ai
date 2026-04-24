// react
import { useEffect, useId, useRef } from "react";

// services, features, and other libraries
import { Option } from "effect";
import { FormReact } from "@lucas-barake/effect-form-react";
import { AnimatePresence } from "motion/react";

// components
import { Label } from "@/components/ui/custom/label";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { ErrorLine } from "@/components/Form";

// types
import type { ComponentPropsWithoutRef } from "react";
import type { MDXEditorMethods } from "@mdxeditor/editor";

interface MarkdownInputProps extends ComponentPropsWithoutRef<typeof MarkdownEditor> {
  label: string;
}

export const MarkdownInput: FormReact.FieldComponent<string, Omit<MarkdownInputProps, "markdown">> = ({ field, props }) => {
  // Get the field context
  const { path, value, onChange, onBlur, error } = field;
  const { label, ...rest } = props;

  // Generate a unique id
  const id = useId();

  // Create refs for both the editor and its markdown
  const editorRef = useRef<MDXEditorMethods>(null);
  const markdownRef = useRef<string>("");

  // Keep the markdown in sync with the field value
  useEffect(() => {
    editorRef.current?.setMarkdown(value);
  }, [value]);

  return (
    <>
      <Label htmlFor={id}>{label}</Label>
      <output id={id} name={path}>
        <MarkdownEditor
          ref={editorRef}
          markdown={value}
          onChange={(markdown) => {
            // Avoid re-rendering the editor on every change
            markdownRef.current = markdown;
          }}
          onBlur={() => {
            onBlur();
            // Update the field value (this will trigger a re-render only once)
            onChange(markdownRef.current);
          }}
          {...rest}
        />
      </output>
      <AnimatePresence>{Option.isSome(error) && <ErrorLine message={error.value} />}</AnimatePresence>
    </>
  );
};

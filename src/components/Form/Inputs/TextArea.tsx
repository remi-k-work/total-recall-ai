// react
import { useId } from "react";

// services, features, and other libraries
import { Hash, Option, pipe } from "effect";
import { FormReact } from "@lucas-barake/effect-form-react";
import { AnimatePresence } from "motion/react";

// components
import { Label } from "@/components/ui/custom/label";
import { Textarea } from "@/components/ui/custom/textarea";
import { ErrorLine } from "@/components/Form";

// types
import type { ComponentPropsWithoutRef } from "react";

interface TextAreaInputProps extends ComponentPropsWithoutRef<typeof Textarea> {
  label?: string;
}

export const TextAreaInput: FormReact.FieldComponent<string, TextAreaInputProps> = ({ field, props }) => {
  // Get the field context
  const { path, value, onChange, onBlur, error } = field;
  const { label, ...rest } = props;

  // Generate a unique id
  const id = useId();

  return (
    <>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Textarea id={id} name={path} value={value} onChange={(ev) => onChange(ev.target.value)} onBlur={onBlur} {...rest} />
      <AnimatePresence>{Option.isSome(error) && <ErrorLine message={error.value} />}</AnimatePresence>
    </>
  );
};

export function TextAreaInputSkeleton({ formName = "global", label, ...rest }: TextAreaInputProps & { formName?: string }) {
  // Generate a hash id from the incoming form name and label
  const id = pipe(`${formName}::${label}`, Hash.string, Math.abs, (hashValue) => `input-${hashValue}`);

  return (
    <>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Textarea id={id} name={label} disabled {...rest} />
    </>
  );
}

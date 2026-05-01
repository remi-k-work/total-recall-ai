// react
import { useId } from "react";

// services, features, and other libraries
import { Hash, Option, pipe } from "effect";
import { FormReact } from "@lucas-barake/effect-form-react";
import { AnimatePresence } from "motion/react";

// components
import { Label } from "@/components/ui/custom/label";
import { Input } from "@/components/ui/custom/input";
import { ErrorLine } from "@/components/Form";

// types
import type { ComponentPropsWithoutRef } from "react";

interface TextInputProps extends ComponentPropsWithoutRef<typeof Input> {
  label: string;
}

export const TextInput: FormReact.FieldComponent<string, TextInputProps> = ({ field, props }) => {
  // Get the field context
  const { path, value, onChange, onBlur, error } = field;
  const { label, ...rest } = props;

  // Generate a unique id
  const id = useId();

  return (
    <>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={path} value={value} onChange={(ev) => onChange(ev.target.value)} onBlur={onBlur} {...rest} />
      <AnimatePresence>{Option.isSome(error) && <ErrorLine message={error.value} />}</AnimatePresence>
    </>
  );
};

export function TextInputSkeleton({ formName = "global", label, ...rest }: TextInputProps & { formName?: string }) {
  // Generate a hash id from the incoming form name and label
  const id = pipe(`${formName}::${label}`, Hash.string, Math.abs, (hashValue) => `input-${hashValue}`);

  return (
    <>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={label} disabled {...rest} />
    </>
  );
}

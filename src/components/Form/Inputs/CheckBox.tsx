// react
import { useId } from "react";

// services, features, and other libraries
import { Option } from "effect";
import { FormReact } from "@lucas-barake/effect-form-react";
import { AnimatePresence } from "motion/react";

// components
import { Label } from "@/components/ui/custom/label";
import { Checkbox } from "@/components/ui/custom/checkbox";
import { ErrorLine } from "@/components/Form";

// types
import type { ComponentPropsWithoutRef } from "react";

interface CheckBoxInputProps extends ComponentPropsWithoutRef<typeof Checkbox> {
  label: string;
}

export const CheckBoxInput: FormReact.FieldComponent<boolean, CheckBoxInputProps> = ({ field, props }) => {
  // Get the field context
  const { path, value, onChange, onBlur, error } = field;
  const { label, ...rest } = props;

  // Generate a unique id
  const id = useId();

  return (
    <>
      <div className="flex items-center gap-1">
        <Checkbox id={id} name={path} checked={value} onCheckedChange={onChange} onBlur={onBlur} {...rest} />
        <Label htmlFor={id}>{label}</Label>
      </div>
      <AnimatePresence>{Option.isSome(error) && <ErrorLine message={error.value} />}</AnimatePresence>
    </>
  );
};

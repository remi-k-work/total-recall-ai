// react
import { useId } from "react";

// services, features, and other libraries
import { useFieldContext } from "@/components/formOld";

// components
import { Label } from "@/components/ui/custom/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FieldErrors from "@/components/formOld/field-errors";

// types
import type { ComponentPropsWithoutRef } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends ComponentPropsWithoutRef<typeof Select<string>> {
  label: string;
  options: SelectOption[];
  placeholder?: string;
}

export default function SelectField({ label, options, placeholder, ...props }: SelectFieldProps) {
  // Get the field context
  const {
    name,
    state: { value },
    handleChange,
    handleBlur,
  } = useFieldContext<string>();

  // Generate a unique id
  const id = useId();

  return (
    <>
      <Label htmlFor={id}>{label}</Label>
      <Select<string> name={name} value={value} onValueChange={(value) => handleChange(value as string)} {...props}>
        <SelectTrigger id={id} onBlur={handleBlur}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldErrors />
    </>
  );
}

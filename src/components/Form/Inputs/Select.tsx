/* eslint-disable @typescript-eslint/no-explicit-any */

// react
import { useId } from "react";

// services, features, and other libraries
import { Hash, Option, pipe } from "effect";
import { FormReact } from "@lucas-barake/effect-form-react";
import { AnimatePresence } from "motion/react";

// components
import { Label } from "@/components/ui/custom/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/custom/select";
import { ErrorLine } from "@/components/Form";

// types
import type { ComponentPropsWithoutRef } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps extends ComponentPropsWithoutRef<typeof Select<string>> {
  label: string;
  options: SelectOption[];
  placeholder?: string;
}

export const SelectInput: FormReact.FieldComponent<any, SelectInputProps> = ({ field, props }) => {
  // Get the field context
  const { path, value, onChange, onBlur, error } = field;
  const { label, options, placeholder, ...rest } = props;

  // Generate a unique id
  const id = useId();

  return (
    <>
      <Label htmlFor={id}>{label}</Label>
      <Select<string> name={path} items={options} value={value} onValueChange={(value) => onChange(value as string)} {...rest}>
        <SelectTrigger id={id} onBlur={onBlur} className="min-w-96">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>
              <p>{placeholder}</p>
            </SelectLabel>
            {options.map(({ value, label }) => (
              <SelectItem key={value} value={value} className="min-w-96">
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <AnimatePresence>{Option.isSome(error) && <ErrorLine message={error.value} />}</AnimatePresence>
    </>
  );
};

export function SelectInputSkeleton({ formName = "global", label, options, placeholder, ...rest }: SelectInputProps & { formName?: string }) {
  // Generate a hash id from the incoming form name and label
  const id = pipe(`${formName}::${label}`, Hash.string, Math.abs, (hashValue) => `input-${hashValue}`);

  return (
    <>
      <Label htmlFor={id}>{label}</Label>
      <Select<string> name={label} items={options} disabled {...rest}>
        <SelectTrigger id={id} className="min-w-96" disabled>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>
              <p>{placeholder}</p>
            </SelectLabel>
            {options.map(({ value, label }) => (
              <SelectItem key={value} value={value} className="min-w-96">
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}

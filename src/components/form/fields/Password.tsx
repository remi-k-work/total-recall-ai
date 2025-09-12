// react
import { useId, useState } from "react";

// other libraries
import { cn } from "@/lib/utils";
import { useFieldContext } from "@/components/form";

// components
import { Label } from "@/components/ui/custom/label";
import { Input } from "@/components/ui/custom/input";
import FieldErrors from "@/components/form/field-errors";

// types
import type { ComponentPropsWithoutRef } from "react";

interface PasswordFieldProps extends ComponentPropsWithoutRef<typeof Input> {
  label: string;
}

export default function PasswordField({ label, className, ...props }: PasswordFieldProps) {
  // Get the field context
  const {
    name,
    state: { value },
    handleChange,
    handleBlur,
  } = useFieldContext<string>();

  // Generate a unique id
  const id = useId();

  // Whether to reveal the password or not
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Label htmlFor={id}>{label}</Label>
      <Input
        type={showPassword ? "text" : "password"}
        id={id}
        name={name}
        value={value}
        onChange={(ev) => handleChange(ev.target.value)}
        onBlur={handleBlur}
        className={cn("pr-10 [&::-ms-reveal]:hidden", className)}
        {...props}
      />
      <FieldErrors />
    </>
  );
}

// react
import { useId, useState } from "react";

// other libraries
import { cn } from "@/lib/utils";
import { useFieldContext } from "@/components/form";

// components
import { Label } from "@/components/ui/custom/label";
import { Input } from "@/components/ui/custom/input";
import { Button } from "@/components/ui/custom/button";
import FieldErrors from "@/components/form/field-errors";

// assets
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

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
      <div className="relative">
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
        <Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-3 -translate-y-1/2">
          {showPassword ? <EyeIcon className="size-6" /> : <EyeSlashIcon className="size-6" />}
        </Button>
      </div>
      <FieldErrors />
    </>
  );
}

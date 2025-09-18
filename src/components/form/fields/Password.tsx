// react
import { useId, useState } from "react";

// next
import Link from "next/link";

// services, features, and other libraries
import { cn } from "@/lib/utils";
import { useFieldContext } from "@/components/form";

// components
import { Label } from "@/components/ui/custom/label";
import { Input } from "@/components/ui/custom/input";
import { Button } from "@/components/ui/custom/button";
import FieldErrors from "@/components/form/field-errors";

// assets
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

// types
import type { ComponentPropsWithoutRef } from "react";

interface PasswordFieldProps extends ComponentPropsWithoutRef<typeof Input> {
  label: string;
  forgotPassHref?: __next_route_internal_types__.RouteImpl<string>;
}

export default function PasswordField({ label, forgotPassHref, className, ...props }: PasswordFieldProps) {
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
      {forgotPassHref ? (
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor={id}>{label}</Label>
          <Link href={forgotPassHref} className="link">
            Forgot your password?
          </Link>
        </div>
      ) : (
        <Label htmlFor={id}>{label}</Label>
      )}
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          id={id}
          name={name}
          value={value}
          onChange={(ev) => handleChange(ev.target.value)}
          onBlur={handleBlur}
          className={cn("pr-18 [&::-ms-reveal]:hidden", className)}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title={showPassword ? "Hide Password" : "Show Password"}
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-1/2 right-3 -translate-y-1/2"
        >
          {showPassword ? <EyeIcon className="size-7" /> : <EyeSlashIcon className="size-7" />}
        </Button>
      </div>
      <FieldErrors />
    </>
  );
}

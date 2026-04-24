// react
import { useId, useState } from "react";

// next
import Link from "next/link";

// services, features, and other libraries
import { cn } from "@/lib/utils";
import { Option } from "effect";
import { FormReact } from "@lucas-barake/effect-form-react";
import { AnimatePresence } from "motion/react";

// components
import { Label } from "@/components/ui/custom/label";
import { Input } from "@/components/ui/custom/input";
import { Button } from "@/components/ui/custom/button";
import { ErrorLine } from "@/components/Form";

// assets
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

// types
import type { ComponentPropsWithoutRef } from "react";
import type { Route } from "next";

interface PasswordInputProps extends ComponentPropsWithoutRef<typeof Input> {
  label: string;
  forgotPassHref?: Route;
  forgotPassText?: string;
}

export const PasswordInput: FormReact.FieldComponent<string, PasswordInputProps> = ({ field, props }) => {
  // Get the field context
  const { path, value, onChange, onBlur, error } = field;
  const { label, forgotPassHref, forgotPassText = "Forgot your password?", className, ...rest } = props;

  // Generate a unique id
  const id = useId();

  // Whether to reveal the password or not
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {forgotPassHref ? (
        <div className="flex items-center justify-between gap-2 md:gap-4">
          <Label htmlFor={id}>{label}</Label>
          <Link href={forgotPassHref} className="link">
            {forgotPassText}
          </Link>
        </div>
      ) : (
        <Label htmlFor={id}>{label}</Label>
      )}
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          id={id}
          name={path}
          value={value}
          onChange={(ev) => onChange(ev.target.value)}
          onBlur={onBlur}
          className={cn("pr-18 [&::-ms-reveal]:hidden", className)}
          {...rest}
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
      <AnimatePresence>{Option.isSome(error) && <ErrorLine message={error.value} />}</AnimatePresence>
    </>
  );
};

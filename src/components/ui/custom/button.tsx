import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  cn(
    "flex shrink-0 items-center justify-center gap-2 border font-semibold tracking-widest whitespace-nowrap uppercase transition-all duration-300 ease-in-out outline-none select-none",
    "hover:shadow-2xl active:scale-95 active:shadow-none",
    "focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
    "aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-disabled:shadow-none",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0"
  ),
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        ghost: "border-input text-foreground",
      },
      size: {
        default: "px-4 py-2",
        sm: "px-3 py-1",
        lg: "px-6 py-3",
        icon: "rounded-full p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({ className, variant = "default", size = "default", ...props }: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return <ButtonPrimitive data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };

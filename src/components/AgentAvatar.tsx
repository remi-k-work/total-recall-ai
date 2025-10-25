// services, features, and other libraries
import { cn } from "@/lib/utils";

// components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/custom/avatar";

// types
import type { ComponentPropsWithoutRef } from "react";

interface AgentAvatarProps extends ComponentPropsWithoutRef<typeof Avatar> {
  isSmall?: boolean;
}

export default function AgentAvatar({ isSmall = false, className, ...props }: AgentAvatarProps) {
  return (
    <Avatar className={cn(isSmall && "size-11", className)} {...props}>
      <AvatarImage src="/logo-oauth-google.png" alt="Total Recall AI" />
      <AvatarFallback className={cn(isSmall && "border-none text-3xl")}>TR</AvatarFallback>
    </Avatar>
  );
}

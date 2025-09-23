// services, features, and other libraries
import { cn } from "@/lib/utils";

// components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/custom/avatar";

// types
import type { ComponentPropsWithoutRef } from "react";

interface UserAvatarProps extends ComponentPropsWithoutRef<typeof Avatar> {
  name: string;
  avatar?: string | Blob;
  isSmall?: boolean;
}

export default function UserAvatar({ name, avatar, isSmall = false, className, ...props }: UserAvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("");

  return (
    <Avatar className={cn(isSmall && "size-11", className)} {...props}>
      <AvatarImage src={avatar} alt={name} />
      <AvatarFallback className={cn(isSmall && "border-none text-3xl")}>{initials}</AvatarFallback>
    </Avatar>
  );
}

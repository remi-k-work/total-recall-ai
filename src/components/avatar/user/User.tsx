// services, features, and other libraries
import { cn } from "@/lib/utils";
import { getInitialsFromName, getUserAvatarUrl } from "@/lib/helpers";

// components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/custom/avatar";

// types
import type { ComponentPropsWithoutRef } from "react";
import type { Session, User } from "@/services/better-auth/auth";

export interface UserAvatarProps extends ComponentPropsWithoutRef<typeof Avatar> {
  user: User;
  session: Session;
  isSmall?: boolean;
}

export default function UserAvatar({ user: { name, image, role }, session: { id: sessionId }, isSmall = false, className, ...props }: UserAvatarProps) {
  return (
    <Avatar className={cn(isSmall && "size-11", className)} {...props}>
      {/* If the user is a demo user, use a different avatar image (always random per session) */}
      <AvatarImage src={role === "demo" ? getUserAvatarUrl(sessionId) : (image ?? undefined)} alt={name} />
      <AvatarFallback className={cn(isSmall && "border-none text-3xl")}>{getInitialsFromName(name)}</AvatarFallback>
    </Avatar>
  );
}

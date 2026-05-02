// services, features, and other libraries
import { cn } from "@/lib/utils";
import { getInitialsFromName, getUserAvatarUrl } from "@/lib/helpers";

// components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/custom/avatar";

// types
import type { ComponentPropsWithoutRef } from "react";
import type { Session, User } from "@/services/better-auth/auth";

export interface UserAvatarSmProps extends ComponentPropsWithoutRef<typeof Avatar> {
  user: User;
  session: Session;
}

export default function UserAvatarSm({ user: { name, image, role }, session: { id: sessionId }, className, ...props }: UserAvatarSmProps) {
  return (
    <Avatar className={cn("size-11", className)} {...props}>
      {/* If the user is a demo user, use a different avatar image (always random per session) */}
      <AvatarImage src={role === "demo" ? getUserAvatarUrl(sessionId) : (image ?? undefined)} alt={name} />
      <AvatarFallback className="border-none text-2xl">{getInitialsFromName(name)}</AvatarFallback>
    </Avatar>
  );
}

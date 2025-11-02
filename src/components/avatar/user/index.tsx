"use client";

// next
import dynamic from "next/dynamic";

// services, features, and other libraries
import { cn } from "@/lib/utils";
import { getInitialsFromName } from "@/lib/helpers";

// components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/custom/avatar";
const User = dynamic(() => import("./User"), { ssr: false });

// types
import type { ComponentPropsWithoutRef } from "react";
import type { Session, User } from "@/services/better-auth/auth";

interface UserAvatarProps extends ComponentPropsWithoutRef<typeof Avatar> {
  user: User;
  session: Session;
  isSmall?: boolean;
}

// constants
import { DEMO_USER_NAME } from "@/drizzle/seed/constants";

export default function UserAvatar(props: UserAvatarProps) {
  return <User {...props} />;
}

export function UserAvatarSkeleton({ isSmall = false, className, ...props }: Omit<UserAvatarProps, "user" | "session">) {
  return (
    <Avatar className={cn(isSmall && "size-11", className)} {...props}>
      <AvatarImage src="https://robohash.org/placeholder.png" alt={DEMO_USER_NAME} />
      <AvatarFallback className={cn(isSmall && "border-none text-3xl")}>{getInitialsFromName(DEMO_USER_NAME)}</AvatarFallback>
    </Avatar>
  );
}

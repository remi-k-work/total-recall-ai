"use client";

// next
import dynamic from "next/dynamic";

// services, features, and other libraries
import { cn } from "@/lib/utils";
import { getInitialsFromName } from "@/lib/helpers";

// components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/custom/avatar";

// types
import type { UserAvatarProps } from "./User";

// constants
import { DEMO_USER_NAME } from "@/drizzle/seed/constants";

export const UserAvatar = dynamic(() => import("./User"), { ssr: false });

export function UserAvatarSkeleton({ isSmall = false, className, ...props }: Omit<UserAvatarProps, "user" | "session">) {
  return (
    <Avatar className={cn(isSmall && "size-11", className)} {...props}>
      <AvatarImage src="https://robohash.org/placeholder.png" alt={DEMO_USER_NAME} />
      <AvatarFallback className={cn(isSmall && "border-none text-3xl")}>{getInitialsFromName(DEMO_USER_NAME)}</AvatarFallback>
    </Avatar>
  );
}

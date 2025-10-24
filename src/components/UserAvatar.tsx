"use client";

// services, features, and other libraries
import { authClient } from "@/services/better-auth/auth-client";
import { cn } from "@/lib/utils";

// components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/custom/avatar";

// types
import type { ComponentPropsWithoutRef } from "react";

interface UserAvatarProps extends ComponentPropsWithoutRef<typeof Avatar> {
  isSmall?: boolean;
}

export default function UserAvatar({ isSmall = false, className, ...props }: UserAvatarProps) {
  // Access the user session data from the client side
  const { data: userSessionData } = authClient.useSession();

  // If there is no user session data, do not render anything
  if (!userSessionData) return null;

  // Destructure the user session data
  const {
    user: { name, image, role },
    session: { id: sessionId },
  } = userSessionData;

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("");

  return (
    <Avatar className={cn(isSmall && "size-11", className)} {...props}>
      {/* If the user is a demo user, use a different avatar image (always random per session) */}
      <AvatarImage src={role === "demo" ? `https://robohash.org/${sessionId}.png?set=set5` : (image ?? undefined)} alt={name} />
      <AvatarFallback className={cn(isSmall && "border-none text-3xl")}>{initials}</AvatarFallback>
    </Avatar>
  );
}

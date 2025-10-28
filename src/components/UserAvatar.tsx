"use client";

// services, features, and other libraries
import { authClient } from "@/services/better-auth/auth-client";
import { cn } from "@/lib/utils";
import { getInitialsFromName, getUserAvatarUrl } from "@/lib/helpers";

// components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/custom/avatar";

// types
import type { ComponentPropsWithoutRef } from "react";

interface UserAvatarProps extends ComponentPropsWithoutRef<typeof Avatar> {
  isSmall?: boolean;
  isDemo?: boolean;
}

// constants
import { DEMO_USER_EMAIL, DEMO_USER_NAME } from "@/drizzle/seed/constants";

export default function UserAvatar({ isSmall = false, isDemo = false, className, ...props }: UserAvatarProps) {
  // If the user is a demo user, use a random and large avatar image (this is for the signing in as a demo user section only)
  if (isDemo) {
    return (
      <section className="grid">
        <Avatar className={cn("mx-auto size-74", className)} {...props}>
          <AvatarImage src={getUserAvatarUrl()} alt={DEMO_USER_NAME} />
          <AvatarFallback>{getInitialsFromName(DEMO_USER_NAME)}</AvatarFallback>
        </Avatar>
        <h4 className="mt-4 max-w-none truncate text-center">{DEMO_USER_NAME}</h4>
        <p className="text-muted-foreground max-w-none truncate text-center">{DEMO_USER_EMAIL}</p>
      </section>
    );
  }

  // Access the user session data from the client side
  const { data: userSessionData } = authClient.useSession();

  // If there is no user session data, do not render anything
  if (!userSessionData) return null;

  // Destructure the user session data
  const {
    user: { name, image, role },
    session: { id: sessionId },
  } = userSessionData;

  return (
    <Avatar className={cn(isSmall && "size-11", className)} {...props}>
      {/* If the user is a demo user, use a different avatar image (always random per session) */}
      <AvatarImage src={role === "demo" ? getUserAvatarUrl(sessionId) : (image ?? undefined)} alt={name} />
      <AvatarFallback className={cn(isSmall && "border-none text-3xl")}>{getInitialsFromName(name)}</AvatarFallback>
    </Avatar>
  );
}

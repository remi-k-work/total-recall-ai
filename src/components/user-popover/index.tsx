"use client";

// react
import { useState } from "react";

// next
import Link from "next/link";

// services, features, and other libraries
import { authClient } from "@/services/better-auth/auth-client";

// components
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/custom/button";
import UserAvatar from "@/components/UserAvatar";
import SignOut from "./SignOut";

// assets
import { UserIcon } from "@heroicons/react/24/outline";

export default function UserPopover() {
  // Access the user session data from the client side
  const { data: userSessionData } = authClient.useSession();

  // Whether or not the user popover is open
  const [isOpen, setIsOpen] = useState(false);

  // If there is no user session data, do not render anything
  if (!userSessionData) return null;

  // Destructure the user session data
  const {
    user: { email, name, image },
  } = userSessionData;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="ghost" size="icon" title={name}>
          <UserAvatar name={name} avatar={image ?? undefined} isSmall />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="grid">
        <UserAvatar name={name} avatar={image ?? undefined} className="mx-auto" />
        <h3 className="mt-4 truncate text-center">{name}</h3>
        <p className="text-muted-foreground truncate text-center">{email}</p>
        <div className="mt-4 grid gap-4">
          <Button variant="ghost" asChild>
            <Link href="/profile" onClick={() => setIsOpen(false)}>
              <UserIcon className="size-9" />
              Profile
            </Link>
          </Button>
          <SignOut onSignedOut={() => setIsOpen(false)} />
        </div>
      </PopoverContent>
    </Popover>
  );
}

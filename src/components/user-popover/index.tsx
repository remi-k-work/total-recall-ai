"use client";

// react
import { useState } from "react";

// next
import Link from "next/link";

// components
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/custom/button";
import UserAvatar, { UserAvatarSkeleton } from "@/components/avatar/user";
import SignOut from "./SignOut";

// assets
import { UserIcon } from "@heroicons/react/24/outline";

// types
import type { Session, User } from "@/services/better-auth/auth";

interface UserPopoverProps {
  user: User;
  session: Session;
}

export default function UserPopover({ user, user: { email, name }, session }: UserPopoverProps) {
  // Whether or not the user popover is open
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="ghost" size="icon" title={name}>
          <UserAvatar user={user} session={session} isSmall />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="grid">
        <UserAvatar user={user} session={session} className="mx-auto" />
        <h4 className="mt-4 truncate text-center">{name}</h4>
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

export function UserPopoverSkeleton() {
  return (
    <Button type="button" variant="ghost" size="icon" title="User" disabled>
      <UserAvatarSkeleton isSmall />
    </Button>
  );
}

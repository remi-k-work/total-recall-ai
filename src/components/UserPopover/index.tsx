"use client";

// react
import { useState } from "react";

// next
import Link from "next/link";

// components
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/custom/popover";
import { Button } from "@/components/ui/custom/button";
import { UserAvatar } from "@/components/Avatar/User";
import SignOut from "./SignOut";

// assets
import { LightBulbIcon, UserIcon } from "@heroicons/react/24/outline";

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
      <PopoverTrigger
        render={
          <Button type="button" variant="ghost" size="icon" title={name}>
            <UserAvatar user={user} session={session} isSmall />
          </Button>
        }
      />
      <PopoverContent className="grid">
        <UserAvatar user={user} session={session} className="mx-auto" />
        <h4 className="mt-4 truncate text-center">{name}</h4>
        <p className="truncate text-center text-muted-foreground">{email}</p>
        <div className="mt-4 grid gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setIsOpen(false);
              window.location.href = "/dashboard";
            }}
          >
            <LightBulbIcon className="size-9" />
            Dashboard
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setIsOpen(false);
              window.location.href = "/profile";
            }}
          >
            <UserIcon className="size-9" />
            Profile
          </Button>
          <SignOut />
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function UserPopoverSkeleton() {
  return (
    <Button
      variant="ghost"
      size="icon"
      title="Dashboard"
      nativeButton={false}
      render={
        <Link href="/dashboard">
          <UserIcon className="size-11" />
        </Link>
      }
    />
  );
}

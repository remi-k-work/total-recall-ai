// components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/custom/avatar";

// types
import type { ComponentPropsWithoutRef } from "react";

interface UserAvatarProps extends ComponentPropsWithoutRef<typeof Avatar> {
  name: string;
  avatar?: string | Blob;
}

export default function UserAvatar({ name, avatar, ...props }: UserAvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("");

  return (
    <Avatar {...props}>
      <AvatarImage src={avatar} alt={name} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}

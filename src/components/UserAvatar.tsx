// components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// types
import type { ComponentPropsWithoutRef } from "react";

interface UserAvatarProps extends ComponentPropsWithoutRef<typeof Avatar> {
  name: string;
  image?: string | Blob;
}

export default function UserAvatar({ name, image, ...props }: UserAvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("");

  return (
    <Avatar {...props}>
      <AvatarImage src={image} alt={name} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}

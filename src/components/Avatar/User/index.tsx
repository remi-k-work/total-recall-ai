"use client";

// next
import dynamic from "next/dynamic";

// assets
import { UserIcon } from "@heroicons/react/24/outline";

export const UserAvatarSm = dynamic(() => import("./UserSm"), { ssr: false, loading: () => <UserAvatarSmSkeleton /> });
export const UserAvatarMd = dynamic(() => import("./UserMd"), { ssr: false, loading: () => <UserAvatarMdSkeleton /> });
export const UserAvatarLg = dynamic(() => import("./UserLg"), { ssr: false, loading: () => <UserAvatarLgSkeleton /> });

export function UserAvatarSmSkeleton() {
  return <UserIcon className="size-11" />;
}

export function UserAvatarMdSkeleton() {
  return <UserIcon className="mx-auto size-36" />;
}

export function UserAvatarLgSkeleton() {
  return <UserIcon className="mx-auto size-74" />;
}

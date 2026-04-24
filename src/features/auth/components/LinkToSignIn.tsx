"use client";

// next
import { usePathname } from "next/navigation";
import Link from "next/link";

// components
import { Button } from "@/components/ui/custom/button";

// assets
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";

// types
interface LinkToSignInProps {
  signInText: string;
}

export default function LinkToSignIn({ signInText }: LinkToSignInProps) {
  // To be able to get the user's original destination
  const pathname = usePathname();

  return (
    <Button
      variant="ghost"
      nativeButton={false}
      render={
        <Link href={`/sign-in?redirect=${pathname}`}>
          <ArrowRightEndOnRectangleIcon className="size-9" />
          {signInText}
        </Link>
      }
    />
  );
}

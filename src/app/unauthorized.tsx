"use client";

// next
import { usePathname } from "next/navigation";
import Link from "next/link";

// components
import { Button } from "@/components/ui/custom/button";

// assets
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";

export default function Page() {
  const pathname = usePathname();

  return (
    <article className="grid h-full place-items-center">
      <h1>401 - Unauthorized</h1>
      <p>You are not authorized to view this page.</p>
      <p>Please sign in to continue.</p>
      <Button variant="ghost" asChild>
        <Link href={`/sign-in?redirect=${pathname}`}>
          <ArrowRightEndOnRectangleIcon className="size-9" />
          Sign In
        </Link>
      </Button>
    </article>
  );
}

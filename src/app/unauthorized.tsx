"use client";

// next
import { usePathname } from "next/navigation";
import Link from "next/link";

// components
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/custom/button";

// assets
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";

export default function Page() {
  const pathname = usePathname();

  return (
    <article className="grid h-full place-items-center">
      <PageHeader title="Unauthorized" description="You are not authorized to view this page" />
      <Button variant="ghost" asChild>
        <Link href={`/sign-in?redirect=${pathname}`}>
          <ArrowRightEndOnRectangleIcon className="size-9" />
          Sign In
        </Link>
      </Button>
    </article>
  );
}

// next
import Link from "next/link";

// components
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/custom/button";

// assets
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";

// types
import type { Metadata } from "next";

// constants
export const metadata: Metadata = {
  title: "Total Recall AI ► Unauthorized",
};

export default function Page() {
  return (
    <article className="grid h-full place-items-center">
      <PageHeader title="Unauthorized" description="You are not authorized to view this page" />
      <Button variant="ghost" asChild>
        <Link href="/sign-in">
          <ArrowRightEndOnRectangleIcon className="size-9" />
          Sign In
        </Link>
      </Button>
    </article>
  );
}

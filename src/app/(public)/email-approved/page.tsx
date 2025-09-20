// next
import Link from "next/link";

// components
import { Button } from "@/components/ui/custom/button";

// assets
import { LightBulbIcon } from "@heroicons/react/24/outline";

// types
import type { Metadata } from "next";

// constants
export const metadata: Metadata = {
  title: "Total Recall AI ► Email Approved",
};

export default function Page() {
  return (
    <article className="grid h-full place-items-center">
      <h1>Email Approved</h1>
      <p>Your email has been approved successfully.</p>
      <Button variant="ghost" asChild>
        <Link href={`/dashboard`}>
          <LightBulbIcon className="size-9" />
          Go to the Dashboard
        </Link>
      </Button>
    </article>
  );
}

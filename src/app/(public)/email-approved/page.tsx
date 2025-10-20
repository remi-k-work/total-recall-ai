// next
import Link from "next/link";

// components
import PageHeader from "@/components/PageHeader";
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
      <PageHeader title="Email Approved" description="Your email has been approved successfully" />
      <Button variant="ghost" asChild>
        <Link href={`/dashboard`}>
          <LightBulbIcon className="size-9" />
          Go to the Dashboard
        </Link>
      </Button>
    </article>
  );
}

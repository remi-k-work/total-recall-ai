// react
import { Suspense } from "react";

// components
import PageHeader from "@/components/PageHeader";
import SignUpForm from "@/features/auth/components/SignUpForm";

// types
import type { Metadata } from "next";

// constants
export const metadata: Metadata = {
  title: "Total Recall AI ► Sign Up",
};

// Page remains the fast, static shell
export default function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContent />
    </Suspense>
  );
}

// This new async component contains the dynamic logic
async function PageContent() {
  return (
    <>
      <PageHeader title="Sign Up" description="Use the form below to sign up" />
      <SignUpForm />
    </>
  );
}

function PageSkeleton() {
  return (
    <>
      <PageHeader title="Sign Up" description="Use the form below to sign up" />
    </>
  );
}

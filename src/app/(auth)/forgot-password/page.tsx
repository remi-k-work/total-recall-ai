// react
import { Suspense } from "react";

// components
import PageHeader from "@/components/PageHeader";
import ForgotPassForm from "@/features/auth/components/ForgotPassForm";

// types
import type { Metadata } from "next";

// constants
export const metadata: Metadata = {
  title: "Total Recall AI ► Forgot Password",
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
      <PageHeader title="Forgot Password" description="Use the form below to reset your password" />
      <ForgotPassForm />
    </>
  );
}

function PageSkeleton() {
  return (
    <>
      <PageHeader title="Forgot Password" description="Use the form below to reset your password" />
    </>
  );
}

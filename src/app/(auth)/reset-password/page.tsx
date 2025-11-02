// react
import { Suspense } from "react";

// services, features, and other libraries
import { validatePageInputs } from "@/lib/helpers";
import { ResetPassPageSchema } from "@/features/auth/schemas/resetPassPage";

// components
import PageHeader from "@/components/PageHeader";
import ResetPassForm from "@/features/auth/components/ResetPassForm";

// types
import type { Metadata } from "next";

// constants
export const metadata: Metadata = {
  title: "Total Recall AI ► Reset Password",
};

// Page remains the fast, static shell
export default function Page({ params, searchParams }: PageProps<"/reset-password">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

// This new async component contains the dynamic logic
async function PageContent({ params, searchParams }: PageProps<"/reset-password">) {
  // Safely validate next.js route inputs (`params` and `searchParams`) against a zod schema; return typed data or trigger a 404 on failure
  const {
    searchParams: { token },
  } = await validatePageInputs(ResetPassPageSchema, { params, searchParams });

  return (
    <>
      <PageHeader title="Reset Password" description="Use the form below to reset your password" />
      <ResetPassForm token={token} />
    </>
  );
}

function PageSkeleton() {
  return (
    <>
      <PageHeader title="Reset Password" description="Use the form below to reset your password" />
    </>
  );
}

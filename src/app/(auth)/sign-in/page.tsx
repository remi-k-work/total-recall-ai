// react
import { Suspense } from "react";

// services, features, and other libraries
import { validatePageInputs } from "@/lib/helpers";
import { SignInPageSchema } from "@/features/auth/schemas/signInPage";

// components
import PageHeader from "@/components/PageHeader";
import SignInForm from "@/features/auth/components/SignInForm";
import SignInDemoUser from "@/features/auth/components/SignInDemoUser";

// types
import type { Metadata, Route } from "next";

// constants
export const metadata: Metadata = {
  title: "Total Recall AI ► Sign In",
};

// Page remains the fast, static shell
export default function Page({ params, searchParams }: PageProps<"/sign-in">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

// This new async component contains the dynamic logic
async function PageContent({ params, searchParams }: PageProps<"/sign-in">) {
  // Safely validate next.js route inputs (`params` and `searchParams`) against a zod schema; return typed data or trigger a 404 on failure
  const {
    searchParams: { redirect },
  } = await validatePageInputs(SignInPageSchema, { params, searchParams });

  return (
    <>
      <PageHeader title="Sign In" description="Use the form below to sign in" />
      <article className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <SignInForm redirect={redirect as Route} />
        <SignInDemoUser redirect={redirect as Route} />
      </article>
    </>
  );
}

function PageSkeleton() {
  return (
    <>
      <PageHeader title="Sign In" description="Use the form below to sign in" />
    </>
  );
}

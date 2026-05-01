// react
import { Suspense } from "react";

// services, features, and other libraries
import { Effect } from "effect";
import { runPageMainOrNavigate, validatePageInputs } from "@/lib/helpersEffect";
import { SignInPageSchema } from "@/features/auth/schemas";

// components
import PageHeader from "@/components/PageHeader";
import SignInForm, { SignInFormSkeleton } from "@/features/auth/components/SignInForm";
import SignInDemoUser, { SignInDemoUserSkeleton } from "@/features/auth/components/SignInDemoUser";

// types
import type { Metadata, Route } from "next";

// constants
export const metadata: Metadata = {
  title: "Total Recall AI ► Sign In",
};

const main = ({ params, searchParams }: PageProps<"/sign-in">) =>
  Effect.gen(function* () {
    // Safely validate next.js route inputs (`params` and `searchParams`) against a schema; return typed data or trigger a 404 on failure
    const {
      searchParams: { redirect },
    } = yield* validatePageInputs(SignInPageSchema, { params, searchParams });

    return { redirect };
  });

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
  // Execute the main effect for the page, map known errors to the subsequent navigation helpers, and return the payload
  const { redirect } = await runPageMainOrNavigate(main({ params, searchParams }));

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
      <article className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <SignInFormSkeleton />
        <SignInDemoUserSkeleton />
      </article>
    </>
  );
}

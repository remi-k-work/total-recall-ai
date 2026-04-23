// react
import { Suspense } from "react";

// next
import { redirect } from "next/navigation";

// services, features, and other libraries
import { Effect } from "effect";
import { runComponentMain } from "@/lib/helpersEffect";
import { Auth } from "@/features/auth/lib/auth";

// components
import Header, { HeaderSkeleton } from "@/components/header";

const main = Effect.gen(function* () {
  // Only check if the current user is authenticated (the check runs on the server side)
  const auth = yield* Auth;
  return yield* auth.getUserSessionData.pipe(
    Effect.as(true),
    Effect.orElse(() => Effect.succeed(false))
  );
});

// Layout remains the fast, static shell
export default function Layout(props: LayoutProps<"/">) {
  return (
    <Suspense fallback={<LayoutSkeleton {...props} />}>
      <LayoutContent {...props} />
    </Suspense>
  );
}

// This new async component contains the dynamic logic
async function LayoutContent({ children }: LayoutProps<"/">) {
  // Execute the main effect for the component, handle known errors, and return the payload
  const isAuthenticated = await runComponentMain(main);

  // If the current user is authenticated, redirect to the dashboard
  if (isAuthenticated) redirect("/dashboard");

  return (
    <>
      <Header />
      <main className="mx-4 [grid-area:main]">{children}</main>
    </>
  );
}

function LayoutSkeleton({ children }: LayoutProps<"/">) {
  return (
    <>
      <HeaderSkeleton />
      <main className="mx-4 [grid-area:main]">{children}</main>
    </>
  );
}

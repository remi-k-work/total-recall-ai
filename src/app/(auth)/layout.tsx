// react
import { Suspense } from "react";

// next
import { redirect } from "next/navigation";

// services, features, and other libraries
import { isUserAuthenticated } from "@/features/auth/lib/helpers";

// components
import Header from "@/components/header";

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
  // Only check if the current user is authenticated (the check runs on the server side)
  const isAuthenticated = await isUserAuthenticated();

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
      <Header />
      <main className="mx-4 [grid-area:main]">{children}</main>
    </>
  );
}

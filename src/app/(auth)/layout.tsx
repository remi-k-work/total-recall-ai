// next
import { redirect } from "next/navigation";

// services, features, and other libraries
import { isUserAuthenticated } from "@/features/auth/lib/helpers";

// components
import Header from "@/components/header";

export default async function Layout({ children }: LayoutProps<"/">) {
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

// components
import SignInForm from "@/features/auth/components/SignInForm";

// types
import type { Metadata } from "next";

// constants
export const metadata: Metadata = {
  title: "Total Recall AI ► Sign In",
};

export default async function Page({ searchParams: searchParamsPromise }: PageProps<"/sign-in">) {
  // Get the "redirect" query parameter
  const { redirect }: { redirect?: __next_route_internal_types__.RouteImpl<string> } = await searchParamsPromise;

  return (
    <>
      <SignInForm redirect={redirect} />
    </>
  );
}

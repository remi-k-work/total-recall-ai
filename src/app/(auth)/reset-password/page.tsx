// next
import { notFound } from "next/navigation";

// components
import ResetPassForm from "@/features/auth/components/ResetPassForm";

// types
import type { Metadata } from "next";

// constants
export const metadata: Metadata = {
  title: "Total Recall AI ► Reset Password",
};

export default async function Page({ searchParams: searchParamsPromise }: PageProps<"/reset-password">) {
  // Get the "token" query parameter
  const { token }: { token?: string } = await searchParamsPromise;

  // If the "token" query parameter is missing, return a 404
  if (!token) notFound();

  return (
    <>
      <ResetPassForm token={token} />
    </>
  );
}

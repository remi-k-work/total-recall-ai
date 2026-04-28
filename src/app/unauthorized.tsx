// components
import PageHeader from "@/components/PageHeader";
import SignInForm from "@/features/auth/components/SignInForm";
import SignInDemoUser from "@/features/auth/components/SignInDemoUser";

// types
import type { Metadata } from "next";

// constants
export const metadata: Metadata = {
  title: "Total Recall AI ► Sign In",
};

export default function Page() {
  return (
    <>
      <PageHeader title="Sign In" description="Use the form below to sign in" />
      <article className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <SignInForm />
        <SignInDemoUser />
      </article>
    </>
  );
}

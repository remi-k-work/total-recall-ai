// components
import PageHeader from "@/components/PageHeader";
import SignUpForm from "@/features/auth/components/SignUpForm";

// types
import type { Metadata } from "next";

// constants
export const metadata: Metadata = {
  title: "Total Recall AI ► Sign Up",
};

export default function Page() {
  return (
    <>
      <PageHeader title="Sign Up" description="Use the form below to sign up" />
      <SignUpForm />
    </>
  );
}

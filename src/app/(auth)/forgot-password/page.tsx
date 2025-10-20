// components
import PageHeader from "@/components/PageHeader";
import ForgotPassForm from "@/features/auth/components/ForgotPassForm";

// types
import type { Metadata } from "next";

// constants
export const metadata: Metadata = {
  title: "Total Recall AI ► Forgot Password",
};

export default function Page() {
  return (
    <>
      <PageHeader title="Forgot Password" description="Use the form below to reset your password" />
      <ForgotPassForm />
    </>
  );
}

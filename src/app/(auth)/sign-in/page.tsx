// components
import SignInForm from "@/features/auth/components/SignInForm";

// types
import type { Metadata } from "next";

// constants
export const metadata: Metadata = {
  title: "Total Recall AI ► Sign In",
};

export default function Page() {
  return (
    <>
      <SignInForm />
    </>
  );
}

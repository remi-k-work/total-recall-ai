// components
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
      <SignUpForm />
    </>
  );
}

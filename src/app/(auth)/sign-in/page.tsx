// services, features, and other libraries
import { validatePageInputs } from "@/lib/helpers";
import { SignInPageSchema } from "@/features/auth/schemas/signInPage";

// components
import SignInForm from "@/features/auth/components/SignInForm";

// types
import type { Metadata, Route } from "next";

// constants
export const metadata: Metadata = {
  title: "Total Recall AI ► Sign In",
};

export default async function Page({ params, searchParams }: PageProps<"/sign-in">) {
  // Safely validate next.js route inputs (`params` and `searchParams`) against a zod schema; return typed data or trigger a 404 on failure
  const {
    searchParams: { redirect },
  } = await validatePageInputs(SignInPageSchema, { params, searchParams });

  return (
    <>
      <SignInForm redirect={redirect as Route} />
    </>
  );
}

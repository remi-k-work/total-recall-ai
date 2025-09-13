// components
import SignInForm from "@/features/auth/components/SignInForm";
import SignUpForm from "@/features/auth/components/SignUpForm";

export default function Home() {
  return (
    <>
      <SignUpForm />
      <SignInForm />
    </>
  );
}

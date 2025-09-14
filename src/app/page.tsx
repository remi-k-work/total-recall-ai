// components
import ForgotPassForm from "@/features/auth/components/ForgotPassForm";
import ResetPassForm from "@/features/auth/components/ResetPassForm";
import SignInForm from "@/features/auth/components/SignInForm";
import SignUpForm from "@/features/auth/components/SignUpForm";

export default function Home() {
  return (
    <>
      <SignUpForm />
      <SignInForm />
      <ForgotPassForm />
      <ResetPassForm />
    </>
  );
}

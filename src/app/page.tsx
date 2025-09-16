// components
import ForgotPassForm from "@/features/auth/components/ForgotPassForm";
import ResetPassForm from "@/features/auth/components/ResetPassForm";
import SignUpForm from "@/features/auth/components/SignUpForm";

export default function Page() {
  return (
    <>
      <SignUpForm />
      <ForgotPassForm />
      <ResetPassForm />
    </>
  );
}

// react
import { useEffect } from "react";

// next
import { useRouter } from "next/navigation";

// components
import { toast } from "sonner";

// types
import type { SignUpFormActionResult } from "@/features/auth/actions/signUpForm";

// Provide feedback to the user regarding this form actions
export default function useSignUpFormFeedback({ actionStatus, actionError, errors }: SignUpFormActionResult, reset: () => void) {
  // To be able to redirect the user after a successful sign up
  const router = useRouter();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (actionStatus === "succeeded") {
      // Display a success message
      toast.success("SUCCESS!", { description: "You signed up successfully." });

      // Reset the entire form after successful submission
      reset();

      // Redirect the user after successful sign up
      timeoutId = setTimeout(() => router.push("/dashboard"), 3000);
    } else if (actionStatus === "invalid") {
      toast.warning("MISSING FIELDS!", { description: "Please correct the [SIGN UP] form fields and try again." });
    } else if (actionStatus === "failed") {
      toast.error("SERVER ERROR!", { description: "The [SIGN UP] form was not submitted successfully; please try again later." });
    } else if (actionStatus === "authError") {
      toast.error("AUTHORIZATION ERROR!", { description: actionError });
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [actionStatus, actionError, errors, reset, router]);
}

// react
import { useEffect } from "react";

// next
import { useRouter } from "next/navigation";

// components
import { toast } from "sonner";

// types
import type { ResetPassFormActionResult } from "@/features/auth/actions/resetPassForm";

// Provide feedback to the user regarding this form actions
export default function useResetPassFormFeedback({ actionStatus, actionError, errors }: ResetPassFormActionResult, reset: () => void) {
  // To be able to redirect the user after a successful password reset
  const router = useRouter();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (actionStatus === "succeeded") {
      // Display a success message
      toast.success("SUCCESS!", { description: "The password has been reset. Please sign in with your new password." });

      // Reset the entire form after successful submission
      reset();

      // Redirect the user after successful password reset
      timeoutId = setTimeout(() => router.push("/sign-in"), 3000);
    } else if (actionStatus === "invalid") {
      toast.warning("MISSING FIELDS!", { description: "Please correct the [RESET PASSWORD] form fields and try again." });
    } else if (actionStatus === "failed") {
      toast.error("SERVER ERROR!", { description: "The [RESET PASSWORD] form was not submitted successfully; please try again later." });
    } else if (actionStatus === "authError") {
      toast.error("AUTHORIZATION ERROR!", { description: actionError });
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [actionStatus, actionError, errors, reset, router]);
}

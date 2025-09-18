// react
import { useEffect } from "react";

// next
import { useRouter } from "next/navigation";

// components
import { toast } from "sonner";

// types
import type { ResetPassFormActionResult } from "@/features/auth/actions/resetPassForm";

// Provide feedback to the user regarding reset pass form actions
export default function useResetPassFormFeedback({ actionStatus, actionError, errors }: ResetPassFormActionResult, reset: () => void) {
  // To be able to redirect the user after a successful password reset
  const router = useRouter();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (actionStatus === "succeeded") {
      toast.success("Success!", { description: "The password has been reset. Please sign in with your new password." });

      // Reset the entire form after successful submission
      reset();

      // Redirect the user after successful password reset
      timeoutId = setTimeout(() => router.push("/sign-in"), 3000);
    } else if (actionStatus === "invalid") {
      toast.warning("Missing fields!", { description: "Please correct the reset password form fields and try again." });
    } else if (actionStatus === "failed") {
      toast.error("Server error!", { description: "The reset password form was not submitted successfully; please try again later." });
    } else if (actionStatus === "authError") {
      toast.error("Authorization error!", { description: actionError });
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [actionStatus, actionError, errors, reset, router]);
}

// react
import { useEffect } from "react";

// next
import { useRouter } from "next/navigation";

// components
import { toast } from "sonner";

// types
import type { SignInFormActionResult } from "@/features/auth/actions/signInForm";

// Provide feedback to the user regarding this form actions
export default function useSignInFormFeedback(
  { actionStatus, actionError, errors }: SignInFormActionResult,
  reset: () => void,
  redirect?: __next_route_internal_types__.RouteImpl<string>,
) {
  // To be able to redirect the user after a successful sign in
  const router = useRouter();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (actionStatus === "succeeded") {
      toast.success("SUCCESS!", { description: "You signed in successfully." });

      // Reset the entire form after successful submission
      reset();

      // Redirect the user after successful sign in
      timeoutId = setTimeout(() => router.push(redirect ?? "/dashboard"), 3000);
    } else if (actionStatus === "invalid") {
      toast.warning("MISSING FIELDS!", { description: "Please correct the [SIGN IN] form fields and try again." });
    } else if (actionStatus === "failed") {
      toast.error("SERVER ERROR!", { description: "The [SIGN IN] form was not submitted successfully; please try again later." });
    } else if (actionStatus === "authError") {
      toast.error("AUTHORIZATION ERROR!", { description: actionError });
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [actionStatus, actionError, errors, reset, router, redirect]);
}

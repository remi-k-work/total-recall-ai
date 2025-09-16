// react
import { useEffect } from "react";

// next
import { useRouter, useSearchParams } from "next/navigation";

// components
import { toast } from "sonner";

// types
import type { SignInFormActionResult } from "@/features/auth/actions/signInForm";

// Provide feedback to the user regarding sign in form actions
export default function useSignInFormFeedback({ actionStatus, actionError, errors }: SignInFormActionResult, reset: () => void) {
  // To be able to redirect the user after a successful sign in
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") as __next_route_internal_types__.RouteImpl<string>;

  useEffect(() => {
    if (actionStatus === "succeeded") {
      toast.success("Success!", { description: "You signed in successfully." });

      // Reset the entire form after successful submission
      reset();

      // Redirect the user after successful sign in
      router.push(redirect ?? "/dashboard");
    } else if (actionStatus === "invalid") {
      toast.warning("Missing fields!", { description: "Please correct the sign in form fields and try again." });
    } else if (actionStatus === "failed") {
      toast.error("Server error!", { description: "The sign in form was not submitted successfully; please try again later." });
    } else if (actionStatus === "authError") {
      toast.error("Authorization error!", { description: actionError });
    }
  }, [actionStatus, actionError, errors, reset, router, redirect]);
}

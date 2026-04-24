// next
import { redirect, useRouter } from "next/navigation";

// services, features, and other libraries
import { Result, useAtomSubscribe } from "@effect-atom/atom-react";
import { ParseError } from "effect/ParseResult";
import { useDemoModeModal } from "@/atoms";
import { authClient } from "@/services/better-auth/auth-client";
import { BetterAuthApiError, UnauthorizedAccessError } from "@/lib/errors";

// components
import { toast } from "sonner";

// types
import type { Atom } from "@effect-atom/atom-react";
import type { Route } from "next";

// Provide feedback to the user regarding this form actions
export function useSubmitToast<A, E>(
  actionAtom: Atom.Atom<Result.Result<A, E>>,
  formName: string,
  succeededDesc: string,
  failedDesc?: string,
  redirectTo?: Route,
  refetchSession?: boolean
) {
  // This is the hook that components use to open the modal
  const { openDemoModeModal } = useDemoModeModal();

  // Access the user session data from the client side
  const { refetch } = authClient.useSession();

  // To be able to refresh the page
  const { refresh } = useRouter();

  // Display the generic toast notifications
  useAtomSubscribe(
    actionAtom,
    (result) =>
      !result.waiting &&
      Result.matchWithError(result, {
        onInitial: () => {},
        onSuccess: () => {
          toast.success("SUCCESS!", { id: "SUCCESS!", description: succeededDesc });

          // Refetch the user session data with the modified changes
          if (refetchSession) {
            refetch();
            refresh();
          }

          // Redirect the user when requested
          if (redirectTo) setTimeout(() => redirect(redirectTo), 3000);
        },
        onError: (error: unknown) => {
          if (error instanceof ParseError)
            toast.warning("MISSING FIELDS!", {
              id: "MISSING FIELDS!",
              description: `Please correct the ${formName} form fields and try again.`,
            });
          if (error instanceof BetterAuthApiError)
            toast.error("AUTHORIZATION ERROR!", {
              id: "AUTHORIZATION ERROR!",
              description: `Something went wrong; please try again later. → ${error.message}`,
            });
          if (error instanceof UnauthorizedAccessError) {
            toast.error("DEMO MODE!", { id: "DEMO MODE!", description: "This action is disabled in demo mode." });
            openDemoModeModal();
          }
        },
        onDefect: () => {
          toast.error("SERVER ERROR!", {
            id: "SERVER ERROR!",
            description: failedDesc ?? `The ${formName} form was not submitted successfully; please try again later.`,
          });
        },
      }),
    { immediate: false }
  );
}

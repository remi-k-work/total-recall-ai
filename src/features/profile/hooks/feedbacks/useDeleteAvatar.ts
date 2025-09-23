// react
import { useEffect } from "react";

// services, features, and other libraries
import { authClient } from "@/services/better-auth/auth-client";

// components
import { toast } from "sonner";

// types
import type { DeleteAvatarActionResult } from "@/features/profile/actions/deleteAvatar";

// Provide feedback to the user regarding this server action
export default function useDeleteAvatarFeedback({ actionStatus, actionError }: DeleteAvatarActionResult) {
  // Access the user session data from the client side
  const { refetch } = authClient.useSession();

  useEffect(() => {
    if (actionStatus === "succeeded") {
      // Display a success message
      toast.success("SUCCESS!", { description: "Your avatar has been deleted." });

      // Refetch the user session data with the modified changes
      refetch();
    } else if (actionStatus === "failed") {
      toast.error("SERVER ERROR!", { description: "Your avatar could not be deleted; please try again later." });
    } else if (actionStatus === "authError") {
      toast.error("AUTHORIZATION ERROR!", { description: actionError });
    }
  }, [actionStatus, actionError, refetch]);
}

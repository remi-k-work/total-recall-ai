"use client";

// react
import { useState } from "react";

// services, features, and other libraries
import { authClient } from "@/services/better-auth/auth-client";

// components
import { Button } from "@/components/ui/custom/button";
import { toast } from "sonner";

// assets
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { Loader2 } from "lucide-react";

export default function SignOut() {
  // Whether or not the sign out request is pending
  const [isPending, setIsPending] = useState(false);

  return (
    <Button
      type="button"
      variant="ghost"
      disabled={isPending}
      onClick={async () => {
        await authClient.signOut({
          fetchOptions: {
            onRequest: () => {
              setIsPending(true);
            },
            onSuccess: () => {
              setIsPending(false);
              window.location.href = "/";
            },
            onError: ({ error: { message } }) => {
              setIsPending(false);
              toast.error("AUTHORIZATION ERROR!", { description: message });
            },
          },
        });
      }}
    >
      {isPending ? <Loader2 className="size-9 animate-spin" /> : <ArrowRightStartOnRectangleIcon className="size-9" />}
      Sign Out
    </Button>
  );
}

"use client";

// react
import { useState } from "react";

// next
import { useRouter } from "next/navigation";

// services
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

  // To be able to redirect the user after a successful sign out
  const router = useRouter();

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
              toast.success("Success!", { description: "You signed out successfully." });
              router.push("/");
            },
            onError: ({ error: { message } }) => {
              setIsPending(false);
              toast.error("Authorization error!", { description: message });
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

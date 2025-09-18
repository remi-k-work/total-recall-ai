"use client";

// react
import { useState } from "react";

// next
import { useRouter } from "next/navigation";

// services, features, and other libraries
import { authClient } from "@/services/better-auth/auth-client";

// components
import { Button } from "@/components/ui/custom/button";
import { toast } from "sonner";

// assets
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { Loader2 } from "lucide-react";

// types
interface SignOutProps {
  onSignedOut: () => void;
}

export default function SignOut({ onSignedOut }: SignOutProps) {
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

              // Notify the parent component
              onSignedOut();
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

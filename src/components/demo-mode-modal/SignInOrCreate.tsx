// react
import { useState } from "react";

// next
import { useRouter } from "next/navigation";

// services, features, and other libraries
import { authClient } from "@/services/better-auth/auth-client";

// components
import { Button } from "@/components/ui/custom/button";

// assets
import { UserIcon } from "@heroicons/react/24/outline";
import { Loader2 } from "lucide-react";

// types
interface SignInOrCreateProps {
  onSignedOut: () => void;
}

export default function SignInOrCreate({ onSignedOut }: SignInOrCreateProps) {
  // Whether or not the sign out request is pending
  const [isPending, setIsPending] = useState(false);

  // To be able to redirect the user after a successful sign out
  const router = useRouter();

  return (
    <Button
      type="button"
      disabled={isPending}
      onClick={async () => {
        await authClient.signOut({
          fetchOptions: {
            onRequest: () => {
              setIsPending(true);
            },
            onSuccess: () => {
              setIsPending(false);
              router.push("/sign-in");

              // Notify the parent component
              onSignedOut();
            },
            onError: () => {
              setIsPending(false);
            },
          },
        });
      }}
    >
      {isPending ? <Loader2 className="size-9 animate-spin" /> : <UserIcon className="size-9" />}
      Sign In or Create Account
    </Button>
  );
}

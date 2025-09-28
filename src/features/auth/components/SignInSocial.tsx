// react
import { useState } from "react";

// services, features, and other libraries
import { authClient } from "@/services/better-auth/auth-client";

// components
import { Button } from "@/components/ui/custom/button";
import { toast } from "sonner";

// assets
import GoogleIcon from "@/assets/icons/Google";
import GitHubIcon from "@/assets/icons/GitHub";
import { Loader2 } from "lucide-react";

// types
interface SignInSocialProps {
  provider: "google" | "github";
  redirect?: __next_route_internal_types__.RouteImpl<string>;
}

export default function SignInSocial({ provider, redirect }: SignInSocialProps) {
  // Whether or not the social sign in request is pending
  const [isPending, setIsPending] = useState(false);

  return (
    <Button
      type="button"
      variant="ghost"
      disabled={isPending}
      onClick={async () => {
        await authClient.signIn.social({
          provider,
          callbackURL: redirect ?? "/dashboard",
          fetchOptions: {
            onRequest: () => {
              setIsPending(true);
            },
            onSuccess: () => {
              setIsPending(false);
              toast.success("SUCCESS!", { description: "You signed in successfully with your social account." });
            },
            onError: ({ error: { message } }) => {
              setIsPending(false);
              toast.error("AUTHORIZATION ERROR!", { description: message });
            },
          },
        });
      }}
    >
      {isPending ? <Loader2 className="size-9 animate-spin" /> : provider === "google" ? <GoogleIcon className="size-9" /> : <GitHubIcon className="size-9" />}
      Sign In With {provider}
    </Button>
  );
}

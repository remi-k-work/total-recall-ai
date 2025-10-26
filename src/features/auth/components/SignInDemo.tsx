"use client";

// react
import { useState } from "react";

// services, features, and other libraries
import { authClient } from "@/services/better-auth/auth-client";

// components
import { Button } from "@/components/ui/custom/button";
import { toast } from "sonner";

// assets
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";
import { Loader2 } from "lucide-react";

// types
import type { Route } from "next";

interface SignInDemoProps {
  redirect?: Route;
}

// constants
import { DEMO_USER_EMAIL, DEMO_USER_PASS } from "@/drizzle/seed/constants";

export default function SignInDemo({ redirect }: SignInDemoProps) {
  // Whether or not the demo sign in request is pending
  const [isPending, setIsPending] = useState(false);

  return (
    <Button
      type="button"
      disabled={isPending}
      className="mx-auto"
      onClick={async () => {
        await authClient.signIn.email({
          email: DEMO_USER_EMAIL,
          password: DEMO_USER_PASS,
          rememberMe: false,
          callbackURL: redirect ?? "/dashboard",
          fetchOptions: {
            onRequest: () => {
              setIsPending(true);
            },
            onError: ({ error: { message } }) => {
              setIsPending(false);
              toast.error("AUTHORIZATION ERROR!", { description: message });
            },
          },
        });
      }}
    >
      {isPending ? <Loader2 className="size-9 animate-spin" /> : <ArrowRightEndOnRectangleIcon className="size-9" />}
      Sign In as a Demo User
    </Button>
  );
}

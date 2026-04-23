// react
import { Suspense } from "react";

// next
import { connection } from "next/server";

// services, features, and other libraries
import { cn } from "@/lib/utils";
import { getInitialsFromName, getUserAvatarUrl } from "@/lib/helpers";

// components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/custom/avatar";

// types
import type { ComponentPropsWithoutRef } from "react";

// constants
import { DEMO_USER_EMAIL, DEMO_USER_NAME } from "@/drizzle/seed/constants";

// Component remains the fast, static shell
export default function DemoAvatar(props: ComponentPropsWithoutRef<typeof Avatar>) {
  // If the user is a demo user, use a random and large avatar image (this is for the signing in as a demo user section only)
  return (
    <Suspense fallback={<DemoAvatarSkeleton {...props} />}>
      <DemoAvatarContent {...props} />
    </Suspense>
  );
}

// This new async component contains the dynamic logic
async function DemoAvatarContent({ className, ...props }: ComponentPropsWithoutRef<typeof Avatar>) {
  await connection();

  return (
    <section className="grid">
      <Avatar className={cn("mx-auto size-74", className)} {...props}>
        <AvatarImage src={getUserAvatarUrl()} alt={DEMO_USER_NAME} />
        <AvatarFallback>{getInitialsFromName(DEMO_USER_NAME)}</AvatarFallback>
      </Avatar>
      <h4 className="mt-4 max-w-none truncate text-center">{DEMO_USER_NAME}</h4>
      <p className="text-muted-foreground max-w-none truncate text-center">{DEMO_USER_EMAIL}</p>
    </section>
  );
}

function DemoAvatarSkeleton({ className, ...props }: ComponentPropsWithoutRef<typeof Avatar>) {
  return (
    <section className="grid">
      <Avatar className={cn("mx-auto size-74", className)} {...props}>
        <AvatarImage src="https://robohash.org/placeholder.png" alt={DEMO_USER_NAME} />
        <AvatarFallback>{getInitialsFromName(DEMO_USER_NAME)}</AvatarFallback>
      </Avatar>
      <h4 className="mt-4 max-w-none truncate text-center">{DEMO_USER_NAME}</h4>
      <p className="text-muted-foreground max-w-none truncate text-center">{DEMO_USER_EMAIL}</p>
    </section>
  );
}

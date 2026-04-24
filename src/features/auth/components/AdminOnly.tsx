// react
import { Suspense } from "react";

// services, features, and other libraries
import { Effect } from "effect";
import { runComponentMain } from "@/lib/helpersEffect";
import { Auth } from "@/features/auth/lib/auth";

// types
import type { ReactNode } from "react";

interface AdminOnlyProps {
  children: ReactNode;
}

const main = Effect.gen(function* () {
  // Assert that the current user has at least one of the allowed roles
  const auth = yield* Auth;
  return yield* auth.assertRoles(["admin", "demo"]).pipe(
    Effect.as(true),
    Effect.orElse(() => Effect.succeed(false)),
  );
});

// Component remains the fast, static shell
export default function AdminOnly({ children }: AdminOnlyProps) {
  return (
    <Suspense>
      <AdminOnlyContent>{children}</AdminOnlyContent>
    </Suspense>
  );
}

// This new async component contains the dynamic logic
async function AdminOnlyContent({ children }: AdminOnlyProps) {
  // Execute the main effect for the component, handle known errors, and return the payload
  const isAdmin = await runComponentMain(main);

  return isAdmin ? <>{children}</> : null;
}

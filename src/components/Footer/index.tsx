// react
import { Suspense } from "react";

// services, features, and other libraries
import { Effect } from "effect";
import { runComponentMain } from "@/lib/helpersEffect";
import { Auth } from "@/features/auth/lib/auth";

// components
import { ConfirmModalRoot } from "@/atoms";
import { DemoModeModalRoot } from "@/atoms";
import { NotesAssistantModalRoot } from "@/atoms";

const main = Effect.gen(function* () {
  // Access the user session data from the server side or fail with an unauthorized access error
  const auth = yield* Auth;
  const { user, session } = yield* auth.getUserSessionData.pipe(Effect.orElse(() => Effect.succeed({ user: null, session: null })));

  return { user, session };
});

// Component remains the fast, static shell
export default function Footer() {
  return (
    <Suspense fallback={<FooterSkeleton />}>
      <FooterContent />
    </Suspense>
  );
}

// This new async component contains the dynamic logic
async function FooterContent() {
  // Execute the main effect for the component, handle known errors, and return the payload
  const { user, session } = await runComponentMain(main);

  return (
    <footer className="[grid-area:footer]">
      <ConfirmModalRoot />
      <DemoModeModalRoot />
      {user && session && <NotesAssistantModalRoot user={user} session={session} />}
    </footer>
  );
}

export function FooterSkeleton() {
  return <footer className="[grid-area:footer]" />;
}

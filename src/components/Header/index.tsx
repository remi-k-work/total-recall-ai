// react
import { Suspense } from "react";

// services, features, and other libraries
import { cn } from "@/lib/utils";
import { Effect } from "effect";
import { runComponentMain } from "@/lib/helpersEffect";
import { Auth } from "@/features/auth/lib/auth";

// components
import { Logo, LogoSkeleton } from "./Logo";
import NavItem, { NavItemSkeleton } from "./NavItem";
import NotesAssistant, { NotesAssistantSkeleton } from "./NotesAssistant";
import UserPopover, { UserPopoverSkeleton } from "@/components/UserPopover";
import { ThemeChanger, ThemeChangerSkeleton } from "@/components/ThemeChanger";

// constants
import { NAV_ITEMS } from "./constants";

const main = Effect.gen(function* () {
  // Access the user session data from the server side or fail with an unauthorized access error
  const auth = yield* Auth;
  const { user, session } = yield* auth.getUserSessionData.pipe(Effect.orElse(() => Effect.succeed({ user: null, session: null })));

  return { user, session };
});

// Component remains the fast, static shell
export default function Header() {
  return (
    <Suspense fallback={<HeaderSkeleton />}>
      <HeaderContent />
    </Suspense>
  );
}

// This new async component contains the dynamic logic
async function HeaderContent() {
  // Execute the main effect for the component, handle known errors, and return the payload
  const { user, session } = await runComponentMain(main);

  return (
    <header
      className={cn("z-10 flex items-center gap-4 bg-linear-to-b from-background via-secondary to-transparent p-2 [grid-area:header]", "lg:sticky lg:top-0")}
    >
      <Logo />
      <nav className="flex flex-1 flex-wrap items-center justify-end gap-4">
        {NAV_ITEMS.map((navItem, index) => (
          <Suspense key={index} fallback={<NavItemSkeleton {...navItem} />}>
            <NavItem {...navItem} />
          </Suspense>
        ))}
        {user && session ? (
          <>
            <NotesAssistant />
            <UserPopover user={user} session={session} />
          </>
        ) : (
          <>
            <NotesAssistantSkeleton />
            <UserPopoverSkeleton />
          </>
        )}
        <ThemeChanger />
      </nav>
    </header>
  );
}

export function HeaderSkeleton() {
  return (
    <header
      className={cn("z-10 flex items-center gap-4 bg-linear-to-b from-background via-secondary to-transparent p-2 [grid-area:header]", "lg:sticky lg:top-0")}
    >
      <LogoSkeleton />
      <nav className="flex flex-1 flex-wrap items-center justify-end gap-4">
        {NAV_ITEMS.map((navItem, index) => (
          <NavItemSkeleton key={index} {...navItem} />
        ))}
        <NotesAssistantSkeleton />
        <UserPopoverSkeleton />
        <ThemeChangerSkeleton />
      </nav>
    </header>
  );
}

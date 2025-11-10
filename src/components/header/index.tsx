// react
import { Suspense } from "react";

// services, features, and other libraries
import { cn } from "@/lib/utils";
import { getUserSessionData } from "@/features/auth/lib/helpers";

// components
import { Logo, LogoSkeleton } from "./logo";
import NavItem, { NavItemSkeleton } from "./NavItem";
import NotesAssistant, { NotesAssistantSkeleton } from "@/features/notes-assistant/components/notes-assistant";
import UserPopover, { UserPopoverSkeleton } from "@/components/user-popover";
import { ThemeChanger, ThemeChangerSkeleton } from "@/components/theme-changer";

// constants
import { NAV_ITEMS } from "./constants";

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
  // Access the user session data from the server side
  const userSessionData = await getUserSessionData();

  return (
    <header
      className={cn("from-background via-secondary z-10 flex items-center gap-4 bg-linear-to-b to-transparent p-2 [grid-area:header]", "lg:sticky lg:top-0")}
    >
      <Logo />
      <nav className="flex flex-1 flex-wrap items-center justify-end gap-4">
        {NAV_ITEMS.map((navItem, index) => (
          <Suspense key={index} fallback={<NavItemSkeleton {...navItem} />}>
            <NavItem {...navItem} />
          </Suspense>
        ))}
        {userSessionData ? (
          <>
            <NotesAssistant user={userSessionData.user} session={userSessionData.session} />
            <UserPopover user={userSessionData.user} session={userSessionData.session} />
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

function HeaderSkeleton() {
  return (
    <header
      className={cn("from-background via-secondary z-10 flex items-center gap-4 bg-linear-to-b to-transparent p-2 [grid-area:header]", "lg:sticky lg:top-0")}
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

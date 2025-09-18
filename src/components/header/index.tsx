// services, features, and other libraries
import { cn } from "@/lib/utils";
import { isUserAuthenticated } from "@/features/auth/lib/helpers";

// components
import Logo from "./Logo";
import NavItem from "./NavItem";
import UserPopover from "@/components/user-popover";
import ThemeChanger from "@/components/theme-changer";

// constants
import { NAV_ITEMS } from "./constants";

export default async function Header() {
  // Only check if the current user is authenticated (the check runs on the server side)
  const isAuthenticated = await isUserAuthenticated();

  return (
    <header className={cn("z-10 mx-4 flex items-center justify-between gap-4 [grid-area:header]", "lg:sticky lg:top-0")}>
      <Logo />
      <nav
        className={cn(
          "grid grid-flow-col place-content-end place-items-center gap-4",
          isAuthenticated ? "grid-cols-4" : "grid-cols-3",
          "*:bg-background *:text-foreground *:hover:text-accent-foreground *:border *:p-3",
        )}
      >
        {NAV_ITEMS.map((navItem, index) => (
          <NavItem key={index} {...navItem} />
        ))}
        {isAuthenticated && <UserPopover />}
        <ThemeChanger />
      </nav>
    </header>
  );
}

// other libraries
import { cn } from "@/lib/utils";

// components
import Logo from "./Logo";
import NavItem from "./NavItem";
import UserPopover from "@/components/user-popover";
import ThemeChanger from "@/components/theme-changer";

// constants
import { NAV_ITEMS } from "./constants";

export default function Header() {
  return (
    <header className={cn("z-10 mx-4 flex items-center justify-between gap-4 [grid-area:header]", "lg:sticky lg:top-0")}>
      <Logo />
      <nav
        className={cn(
          "grid place-content-end place-items-center gap-4",
          "grid-flow-row grid-cols-4",
          "*:bg-background *:text-foreground *:hover:text-accent-foreground *:border *:p-3",
        )}
      >
        {NAV_ITEMS.map((navItem, index) => (
          <NavItem key={index} {...navItem} />
        ))}
        <UserPopover />
        <ThemeChanger />
      </nav>
    </header>
  );
}

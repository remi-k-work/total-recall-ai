// assets
import { HomeIcon, UserIcon } from "@heroicons/react/24/outline";

// constants
export const NAV_ITEMS = [
  {
    href: "/",
    title: "Home",
    icon: <HomeIcon />,
  },
  {
    href: "/dashboard",
    title: "Dashboard",
    icon: <UserIcon />,
  },
] as const;

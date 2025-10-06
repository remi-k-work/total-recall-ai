// assets
import { HomeIcon, LightBulbIcon, UserIcon } from "@heroicons/react/24/outline";

// constants
export const NAV_ITEMS = [
  {
    href: "/notes",
    title: "Notes",
    icon: <HomeIcon />,
  },
  {
    href: "/dashboard",
    title: "Dashboard",
    icon: <LightBulbIcon />,
  },
  {
    href: "/profile",
    title: "Profile",
    icon: <UserIcon />,
  },
] as const;

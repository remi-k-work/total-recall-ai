// assets
import { AcademicCapIcon, HomeIcon } from "@heroicons/react/24/solid";

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
    icon: <AcademicCapIcon />,
  },
] as const;

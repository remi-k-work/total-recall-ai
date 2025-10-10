// assets
import { DocumentDuplicateIcon, LightBulbIcon, UserIcon } from "@heroicons/react/24/outline";

// constants
export const NAV_ITEMS = [
  {
    href: "/dashboard",
    match: "^/dashboard(/.*)?$",
    title: "Dashboard",
    icon: <LightBulbIcon />,
  },
  {
    href: "/notes",
    match: "^/notes(/.*)?$",
    title: "Notes",
    icon: <DocumentDuplicateIcon />,
  },
  {
    href: "/profile",
    match: "^/profile(/.*)?$",
    title: "Profile",
    icon: <UserIcon />,
  },
] as const;

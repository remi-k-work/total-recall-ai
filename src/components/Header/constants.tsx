// assets
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";

// constants
export const NAV_ITEMS = [
  {
    href: "/notes",
    match: "^/notes(/.*)?$",
    title: "Notes",
    icon: <DocumentDuplicateIcon />,
  },
] as const;

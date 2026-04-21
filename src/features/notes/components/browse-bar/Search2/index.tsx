// services, features, and other libraries
import { selStrAtom, useBrowseBar } from "@/atoms";
import { useAtomValue } from "@effect-atom/atom-react";

// components
import { Badge } from "@/components/ui/custom/badge";
import { Input } from "@/components/ui/custom/input";

// types
import type { BrowseBar } from "@/atoms";

interface SearchProps {
  kind: "root" | "new" | "edit" | "details";
  borwseBar: BrowseBar;
  totalItems: number;
}

export default function Search({ kind, borwseBar, totalItems }: SearchProps) {
  // Manages browse bar state, including hydration, zero-read setter actions, and debounced url synchronization
  const str = useAtomValue(selStrAtom);
  const { setStr } = useBrowseBar(borwseBar);

  // Render the search form for the "notes root" kind
  if (kind === "root") {
    return (
      <section className="flex items-center gap-2">
        <Badge>{totalItems}</Badge>
        <Input
          type="search"
          name="str"
          size={15}
          maxLength={25}
          aria-label="Search Notes"
          placeholder="Search Notes"
          value={str}
          onChange={(ev) => setStr(ev.target.value)}
        />
      </section>
    );
  }

  // Otherwise, render the search form for the "note details" kind
  return (
    <Input
      type="search"
      name="str"
      size={15}
      maxLength={25}
      aria-label="Search Notes"
      placeholder="Search Notes"
      value={str}
      onChange={(ev) => setStr(ev.target.value)}
    />
  );
}

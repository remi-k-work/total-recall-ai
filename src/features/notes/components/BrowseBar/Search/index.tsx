// services, features, and other libraries
import { browseBarStrAtom, useBrowseBar } from "@/atoms";
import { useAtomValue } from "@effect-atom/atom-react";

// components
import { Badge } from "@/components/ui/custom/badge";
import { Input } from "@/components/ui/custom/input";

// types
import type { BrowseBar } from "@/atoms";

interface Root {
  kind: "root";
  browseBar: BrowseBar;
  totalItems: number;
}

interface Rest {
  kind: "new" | "edit" | "details";
  browseBar: BrowseBar;
}

type SearchProps = Root | Rest;

export default function Search(props: SearchProps) {
  // Manages browse bar state, including hydration, zero-read setter actions, and debounced url synchronization
  const { browseBar } = props;
  const str = useAtomValue(browseBarStrAtom);
  const { setStr } = useBrowseBar(browseBar);

  if (props.kind === "root") {
    const { totalItems } = props;

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
  } else
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

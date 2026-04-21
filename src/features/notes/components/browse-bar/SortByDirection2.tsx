// services, features, and other libraries
import { selSbdAtom, useBrowseBar } from "@/atoms";
import { useAtomValue } from "@effect-atom/atom-react";

// components
import { Label } from "@/components/ui/custom/label";
import { Switch } from "@/components/ui/custom/switch";

// types
import type { BrowseBar } from "@/atoms";

interface SortByDirectionProps {
  borwseBar: BrowseBar;
  totalItems: number;
}

export default function SortByDirection({ borwseBar, totalItems }: SortByDirectionProps) {
  // Manages browse bar state, including hydration, zero-read setter actions, and debounced url synchronization
  const sbd = useAtomValue(selSbdAtom);
  const { setSbd } = useBrowseBar(borwseBar);

  return (
    <Label className="flex items-center border px-3 font-normal">
      DESC<span className="mr-1 text-3xl text-muted-foreground">▽</span>
      <Switch
        name="sortDirection"
        aria-label="Sort Direction"
        title="Sort Direction"
        disabled={totalItems <= 1}
        checked={sbd === "asc"}
        onCheckedChange={(isAsc) => setSbd(isAsc ? "asc" : "desc")}
      />
      <span className="ml-1 text-3xl text-muted-foreground">△</span>ASC
    </Label>
  );
}

// services, features, and other libraries
import { selSbfAtom, useBrowseBar } from "@/atoms";
import { useAtomValue } from "@effect-atom/atom-react";

// components
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/custom/toggle-group";

// assets
import { CalendarIcon, LanguageIcon } from "@heroicons/react/24/outline";

// types
import type { BrowseBar } from "@/atoms";

interface SortByFieldProps {
  borwseBar: BrowseBar;
  totalItems: number;
}

export default function SortByField({ borwseBar, totalItems }: SortByFieldProps) {
  // Manages browse bar state, including hydration, zero-read setter actions, and debounced url synchronization
  const sbf = useAtomValue(selSbfAtom);
  const { setSbf } = useBrowseBar(borwseBar);

  return (
    <ToggleGroup disabled={totalItems <= 1} value={[sbf]} onValueChange={([sbf]) => setSbf(sbf as BrowseBar["sbf"])} className="items-start">
      <ToggleGroupItem value="title" aria-label="Sort By Note Title" title="Sort By Note Title" className="flex-col text-center whitespace-pre-line">
        <LanguageIcon className="size-11" />
        {"Note Title".replaceAll(" ", "\n")}
      </ToggleGroupItem>
      <ToggleGroupItem value="created_at" aria-label="Sort By Created At" title="Sort By Created At" className="flex-col text-center whitespace-pre-line">
        <CalendarIcon className="size-11" />
        {"Created At".replaceAll(" ", "\n")}
      </ToggleGroupItem>
      <ToggleGroupItem value="updated_at" aria-label="Sort By Updated At" title="Sort By Updated At" className="flex-col text-center whitespace-pre-line">
        <CalendarIcon className="size-11" />
        {"Updated At".replaceAll(" ", "\n")}
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

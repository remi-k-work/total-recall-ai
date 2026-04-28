// react
import { useMemo } from "react";

// services, features, and other libraries
import { browseBarFbtAtom, useBrowseBar } from "@/atoms";
import { useAtomValue } from "@effect-atom/atom-react";

// components
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/custom/popover";
import { Badge } from "@/components/ui/custom/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/custom/toggle-group";

// types
import type { BrowseBar } from "@/atoms";
import type { AvailNoteTags } from "@/features/notes/db";

interface FilterByTagsProps {
  browseBar: BrowseBar;
  availNoteTags: AvailNoteTags;
}

export default function FilterByTags({ browseBar, availNoteTags }: FilterByTagsProps) {
  // Manages browse bar state, including hydration, zero-read setter actions, and debounced url synchronization
  const fbt = useAtomValue(browseBarFbtAtom);
  const { setFbt } = useBrowseBar(browseBar);

  // Compute selected tag objects for rendering badges
  const selectedTags = useMemo(() => {
    const selectedSet = new Set(fbt);
    return availNoteTags.filter((_, index) => selectedSet.has(index));
  }, [fbt, availNoteTags]);

  return (
    <Popover>
      <PopoverTrigger
        className="group flex w-96 flex-wrap items-center justify-center gap-2 rounded-md p-3 transition-colors duration-1000 ease-in-out hover:bg-accent"
        aria-label="🏷️ Filter Notes by Tags"
        title="🏷️ Filter Notes by Tags"
      >
        {selectedTags.length === 0 ? (
          <Badge variant="outline" className="w-full p-3 transition-colors duration-1000 ease-in-out group-hover:text-accent-foreground">
            🏷️ Filter Notes by Tags
          </Badge>
        ) : (
          selectedTags.map(({ id, name }) => <Badge key={id}>{name}</Badge>)
        )}
      </PopoverTrigger>
      <PopoverContent side="top" className="w-96">
        <ToggleGroup multiple value={fbt.map(String)} onValueChange={(value) => setFbt(value.map(Number))} className="w-full flex-wrap justify-center">
          {availNoteTags.map(({ id, name }, index) => (
            <ToggleGroupItem key={id} value={String(index)} aria-label={`Toggle: ${name}`} title={`Toggle: ${name}`}>
              {name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </PopoverContent>
    </Popover>
  );
}

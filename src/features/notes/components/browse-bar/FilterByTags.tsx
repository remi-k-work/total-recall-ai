// react
import { useEffect, useMemo, useState } from "react";

// services, features, and other libraries
import { useBrowseBarContext } from "./context";
import { useDebouncedCallback } from "use-debounce";

// components
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/custom/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/custom/toggle-group";

// assets
import { TagIcon } from "@heroicons/react/24/outline";

export default function FilterByTags() {
  // Access the browse bar context and retrieve all necessary information
  const { availNoteTags, filterByTagIndxs, navigate } = useBrowseBarContext("notes-root");

  // Currently toggled filter by tags (we only store their indexes relative to the complete list of available note tags for this user)
  const [currFilterByTagIndxs, setCurrFilterByTagIndxs] = useState(filterByTagIndxs);

  // Keep the currently toggled filter by tags in sync with search params
  useEffect(() => {
    setCurrFilterByTagIndxs(filterByTagIndxs);
  }, [filterByTagIndxs]);

  // Note tags that are currently selected - we use useMemo here because filtering arrays on every render is expensive
  const selectedNoteTags = useMemo(() => {
    // Performance optimization (O(N) -> O(1) lookup)
    const selectedSet = new Set(currFilterByTagIndxs);

    // Retain only the tags that are currently selected from the complete list of available note tags for this user
    return availNoteTags.filter((_, index) => selectedSet.has(index));
  }, [currFilterByTagIndxs, availNoteTags]);

  // Use the debounced callback to initiate the relevant actions
  const handleToggledNoteTags = useDebouncedCallback((filterByTagIndxs: string[]) => {
    // Refresh the page with the new filter by tags
    navigate({ fbt: filterByTagIndxs, crp: 1 });
  }, 3000);

  return (
    <Popover>
      <PopoverTrigger className="flex w-96 flex-wrap items-center justify-center gap-2">
        {selectedNoteTags.length === 0 ? (
          <Badge variant="outline" className="w-full p-3 uppercase">
            <TagIcon className="size-9" />
            Filter By Tags...
          </Badge>
        ) : (
          selectedNoteTags.map(({ id, name }) => <Badge key={id}>{name}</Badge>)
        )}
      </PopoverTrigger>
      <PopoverContent side="top" className="w-96">
        <ToggleGroup
          type="multiple"
          spacing={2}
          value={currFilterByTagIndxs.map(String)}
          onValueChange={(value) => {
            // Immediate UI update of the toggled tags
            setCurrFilterByTagIndxs(value.map(Number));

            // The page refresh is debounced when the tags are toggled
            handleToggledNoteTags(value);
          }}
          className="w-full flex-wrap justify-center"
        >
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

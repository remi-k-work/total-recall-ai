// react
import { useEffect, useState } from "react";

// services, features, and other libraries
import { useBrowseBarContext } from "./context";

// components
import { Label } from "@/components/ui/custom/label";
import { Switch } from "@/components/ui/custom/switch";

export default function SortByDirection() {
  // Access the browse bar context and retrieve all necessary information
  const { totalPages, sortByDirection, navigate } = useBrowseBarContext("notes-root");

  // Currently selected sort by direction
  const [currSortByDirection, setCurrSortByDirection] = useState(sortByDirection);

  // Keep the currently selected sort by direction in sync with search params
  useEffect(() => {
    setCurrSortByDirection(sortByDirection);
  }, [sortByDirection]);

  return (
    <Label className="flex items-center border px-3 font-normal">
      DESC<span className="text-muted-foreground mr-1 text-3xl">▽</span>
      <Switch
        name="sortDirection"
        aria-label="Sort Direction"
        title="Sort Direction"
        disabled={totalPages <= 1}
        checked={currSortByDirection === "asc"}
        onCheckedChange={(isAscending) => {
          setCurrSortByDirection(isAscending ? "asc" : "desc");
          navigate({ sbd: isAscending ? "asc" : "desc" });
        }}
      />
      <span className="text-muted-foreground ml-1 text-3xl">△</span>ASC
    </Label>
  );
}

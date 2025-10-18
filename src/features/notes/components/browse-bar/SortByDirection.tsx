// services, features, and other libraries
import { useBrowseBarContext } from "./Context";
import useUrlScribe from "@/hooks/useUrlScribe";

// components
import { Label } from "@/components/ui/custom/label";
import { Switch } from "@/components/ui/custom/switch";

export default function SortByDirection() {
  // Access the browse bar context and retrieve all necessary information
  const browseBarContext = useBrowseBarContext();

  // A hook to easily create new route strings with updated search parameters (it preserves existing search params)
  const { navigate } = useUrlScribe();

  // Render the sort by direction only for the "notes root" kind
  if (browseBarContext.kind !== "notes-root") return null;
  const { totalPages, sortByDirection } = browseBarContext;

  return (
    <Label className="flex items-center border px-3 font-normal">
      DESC<span className="text-muted-foreground mr-1 text-3xl">▽</span>
      <Switch
        name="sortDirection"
        aria-label="Sort Direction"
        title="Sort Direction"
        disabled={totalPages <= 1}
        defaultChecked={sortByDirection === "asc"}
        onCheckedChange={(isAscending) => navigate({ sbd: isAscending ? "asc" : "desc" })}
      />
      <span className="text-muted-foreground ml-1 text-3xl">△</span>ASC
    </Label>
  );
}

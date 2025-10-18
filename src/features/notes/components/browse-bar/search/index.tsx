// next
import Form from "next/form";
import { useSearchParams } from "next/navigation";

// services, features, and other libraries
import { useBrowseBarContext } from "@/features/notes/components/browse-bar/Context";

// components
import { Badge } from "@/components/ui/custom/badge";
import { Input } from "@/components/ui/custom/input";
import SearchButton from "./SearchButton";

export default function Search() {
  // Access the browse bar context and retrieve all necessary information
  const browseBarContext = useBrowseBarContext();

  // Sync the search form with the search term in the url
  const searchParams = useSearchParams();
  const str = searchParams.get("str") ?? undefined;

  // Render the search form for the "notes root" kind
  if (browseBarContext.kind === "notes-root") {
    const { totalItems, searchRoute } = browseBarContext;

    return (
      <Form action={searchRoute} className="flex items-center gap-2">
        <Badge>{totalItems}</Badge>
        <Input type="search" name="str" size={15} maxLength={25} aria-label="Search Notes" placeholder="Search Notes" defaultValue={str} />
        <SearchButton />
      </Form>
    );
  }

  // Otherwise, render the search form for the "note details" kind
  const { searchRoute } = browseBarContext;

  return (
    <Form action={searchRoute} className="flex items-center gap-2">
      <Input type="search" name="str" size={15} maxLength={25} aria-label="Search Notes" placeholder="Search Notes" defaultValue={str} />
      <SearchButton />
    </Form>
  );
}

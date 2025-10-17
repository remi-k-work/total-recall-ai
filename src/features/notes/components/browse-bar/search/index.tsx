// next
import Form from "next/form";

// services, features, and other libraries
import { useBrowseBarContext } from "@/features/notes/components/browse-bar/Context";

// components
import { Badge } from "@/components/ui/custom/badge";
import { Input } from "@/components/ui/custom/input";
import SearchButton from "./SearchButton";

export default function Search() {
  // Access the browse bar context and retrieve all necessary information
  const { totalItems, searchRoute } = useBrowseBarContext();

  return (
    <Form action={searchRoute} className="flex items-center gap-2">
      <Badge>{totalItems}</Badge>
      <Input type="search" name="str" size={15} maxLength={25} aria-label="Search Notes" placeholder="Search Notes" />
      <SearchButton />
    </Form>
  );
}

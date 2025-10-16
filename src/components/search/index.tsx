// next
import Form from "next/form";

// components
import { Input } from "@/components/ui/custom/input";
import SearchButton from "./SearchButton";

// types
import type { Route } from "next";

interface SearchProps {
  action: Route;
}

export default function Search({ action }: SearchProps) {
  return (
    <Form action={action} className="flex items-center gap-2">
      <Input type="search" name="query" size={15} maxLength={25} aria-label="Search" placeholder="Search Notes" />
      <SearchButton />
    </Form>
  );
}

// react
import { useMemo } from "react";

// next
import Link from "next/link";

// services, features, and other libraries
import { useBrowseBarContext } from "./Context";
import useUrlScribe from "@/hooks/useUrlScribe";

// components
import { Button } from "@/components/ui/custom/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// assets
import { ArrowLeftCircleIcon, ArrowRightCircleIcon, CheckIcon } from "@heroicons/react/24/outline";

export default function Paginate() {
  // Access the browse bar context and retrieve all necessary information
  const { totalPages, currentPage } = useBrowseBarContext();

  // A hook to easily create new route strings with updated search parameters (it preserves existing search params)
  const { createHref } = useUrlScribe();

  // Generate a list of all page numbers [1, 2, ..., totalPages]
  const pageNumbers = useMemo(() => [...Array(totalPages).keys()].map((i) => i + 1), [totalPages]);

  // Skip rendering if there is no pages
  if (totalPages === 0) return null;

  return (
    <section className="flex items-center gap-2">
      <Button size="icon" variant="ghost" title="Previous Page" asChild>
        <Link href={createHref({ crp: Math.max(1, currentPage - 1) })}>
          <ArrowLeftCircleIcon className="size-9" />
        </Link>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" title="Change Page">
            {currentPage}&nbsp;/&nbsp;{totalPages}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {pageNumbers.map((pageNumber) =>
            pageNumber === currentPage ? (
              <DropdownMenuItem key={pageNumber} className="justify-between text-xl">
                {pageNumber}
                <CheckIcon className="size-6" />
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem key={pageNumber} className="text-xl" asChild>
                <Link href={createHref({ crp: pageNumber })}>{pageNumber}</Link>
              </DropdownMenuItem>
            ),
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button size="icon" variant="ghost" title="Next Page" asChild>
        <Link href={createHref({ crp: Math.min(totalPages, currentPage + 1) })}>
          <ArrowRightCircleIcon className="size-9" />
        </Link>
      </Button>
    </section>
  );
}

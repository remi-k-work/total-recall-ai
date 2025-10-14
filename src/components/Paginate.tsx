"use client";

// react
import { useCallback, useMemo } from "react";

// next
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

// components
import { Button } from "@/components/ui/custom/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// assets
import { ArrowLeftCircleIcon, ArrowRightCircleIcon, CheckIcon } from "@heroicons/react/24/outline";

// types
interface PaginateProps {
  currentPage: number;
  totalPages: number;
  prevPageNumber: number;
  nextPageNumber: number;
}

export default function Paginate({ currentPage, totalPages, prevPageNumber, nextPageNumber }: PaginateProps) {
  // Access the current route's pathname and query parameters
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Build a new href with the provided search params while preserving existing ones
  const buildNewHref = useCallback(
    (currentPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("p", String(currentPage));

      return `${pathname}?${params.toString()}` as __next_route_internal_types__.RouteImpl<string>;
    },
    [searchParams, pathname],
  );

  // Generate a list of all page numbers [1, 2, ..., totalPages]
  const pageNumbers = useMemo(() => [...Array(totalPages).keys()].map((i) => i + 1), [totalPages]);

  // Skip rendering if there is only one or zero pages
  if (totalPages <= 1) return null;

  return (
    <section className="flex items-center gap-2">
      <Button size="icon" variant="ghost" title="Previous Page" asChild>
        <Link href={buildNewHref(prevPageNumber)}>
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
                <Link href={buildNewHref(pageNumber)}>{pageNumber}</Link>
              </DropdownMenuItem>
            ),
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button size="icon" variant="ghost" title="Next Page" asChild>
        <Link href={buildNewHref(nextPageNumber)}>
          <ArrowRightCircleIcon className="size-9" />
        </Link>
      </Button>
    </section>
  );
}

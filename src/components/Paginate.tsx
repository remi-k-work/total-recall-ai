"use client";

// react
import { useState } from "react";

// next
import Link from "next/link";

// services, features, and other libraries
import { cn } from "@/lib/utils";

// components
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// assets
import { BackwardIcon, CheckIcon, ForwardIcon } from "@heroicons/react/24/solid";

// types
interface PaginateProps {
  currentPage: number;
  totalPages: number;
  prevPageNumber: number;
  nextPageNumber: number;
}

export default function Paginate({ currentPage, totalPages, prevPageNumber, nextPageNumber }: PaginateProps) {
  // Whether or not the dropdown menu is open
  //   const [open, setOpen] = useState(false);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);

  // Do not render anything if there are no items to display
  if (totalPages === 0) return null;

  return (
    <section>
      <Link href={`/notes?page=${prevPageNumber}`}>
        <BackwardIcon width={24} height={24} />
      </Link>
      {/* <DropdownMenu open={open} onOpenChange={setOpen}> */}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <header>
            {currentPage}&nbsp;/&nbsp;{totalPages}
          </header>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {pageNumbers.map((pageNumber) =>
            pageNumber === currentPage ? (
              <DropdownMenuItem key={pageNumber}>
                {pageNumber}
                <CheckIcon width={24} height={24} />
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem key={pageNumber}>
                <Link href={`/notes?page=${pageNumber}`}>{pageNumber}</Link>
              </DropdownMenuItem>
            ),
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <Link href={`/notes?page=${nextPageNumber}`}>
        <ForwardIcon width={24} height={24} />
      </Link>
    </section>
  );
}

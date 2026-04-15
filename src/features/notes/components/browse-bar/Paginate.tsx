// next
import Link from "next/link";

// services, features, and other libraries
import { useBrowseBarContext } from "./context";

// components
import { Button } from "@/components/ui/custom/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/custom/dropdown-menu";

// assets
import { ArrowLeftCircleIcon, ArrowRightCircleIcon, CheckIcon } from "@heroicons/react/24/outline";

export default function Paginate() {
  // Access the browse bar context and retrieve all necessary information
  const { totalPages, currentPage, createHref } = useBrowseBarContext("notes-root");

  return (
    <section className="flex items-center gap-2">
      <Button
        size="icon"
        variant="ghost"
        title="Previous Page"
        disabled={currentPage === 1 || totalPages <= 1}
        nativeButton={false}
        render={
          <Link href={createHref({ crp: Math.max(1, currentPage - 1) })}>
            <ArrowLeftCircleIcon className="size-9" />
          </Link>
        }
      ></Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            totalPages <= 1 ? (
              <Button type="button" variant="ghost" title="Change Page" disabled>
                {currentPage}&nbsp;/&nbsp;{currentPage}
              </Button>
            ) : (
              <Button type="button" variant="ghost" title="Change Page">
                {currentPage}&nbsp;/&nbsp;{totalPages}
              </Button>
            )
          }
        />
        <DropdownMenuContent>
          {[...Array(totalPages).keys()]
            .map((i) => i + 1)
            .map((pageNumber) =>
              pageNumber === currentPage ? (
                <DropdownMenuItem key={pageNumber} className="justify-between text-xl">
                  {pageNumber}
                  <CheckIcon className="size-6" />
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem key={pageNumber} className="text-xl" render={<Link href={createHref({ crp: pageNumber })}>{pageNumber}</Link>} />
              )
            )}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        size="icon"
        variant="ghost"
        title="Next Page"
        disabled={currentPage === totalPages || totalPages <= 1}
        nativeButton={false}
        render={
          <Link href={createHref({ crp: Math.min(totalPages, currentPage + 1) })}>
            <ArrowRightCircleIcon className="size-9" />
          </Link>
        }
      ></Button>
    </section>
  );
}

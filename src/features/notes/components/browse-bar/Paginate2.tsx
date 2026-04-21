// services, features, and other libraries
import { selCrpAtom, useBrowseBar } from "@/atoms";
import { useAtomValue } from "@effect-atom/atom-react";

// components
import { Button } from "@/components/ui/custom/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/custom/dropdown-menu";

// assets
import { ArrowLeftCircleIcon, ArrowRightCircleIcon, CheckIcon } from "@heroicons/react/24/outline";

// types
import type { BrowseBar } from "@/atoms";

interface PaginateProps {
  borwseBar: BrowseBar;
  totalPages: number;
}

export default function Paginate({ borwseBar, totalPages }: PaginateProps) {
  // Manages browse bar state, including hydration, zero-read setter actions, and debounced url synchronization
  const crp = useAtomValue(selCrpAtom);
  const { setCrp } = useBrowseBar(borwseBar);

  return (
    <section className="flex items-center gap-2">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        title="Previous Page"
        disabled={crp === 1 || totalPages <= 1}
        onClick={() => setCrp(Math.max(1, crp - 1))}
      >
        <ArrowLeftCircleIcon className="size-9" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            totalPages <= 1 ? (
              <Button type="button" variant="ghost" title="Change Page" disabled>
                {crp}&nbsp;/&nbsp;{crp}
              </Button>
            ) : (
              <Button type="button" variant="ghost" title="Change Page">
                {crp}&nbsp;/&nbsp;{totalPages}
              </Button>
            )
          }
        />
        <DropdownMenuContent>
          {[...Array(totalPages).keys()]
            .map((i) => i + 1)
            .map((pageNumber) =>
              pageNumber === crp ? (
                <DropdownMenuItem key={pageNumber} className="justify-between text-xl">
                  {pageNumber}
                  <CheckIcon className="size-6" />
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem key={pageNumber} className="text-xl" onClick={() => setCrp(pageNumber)}>
                  {pageNumber}
                </DropdownMenuItem>
              )
            )}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        title="Next Page"
        disabled={crp === totalPages || totalPages <= 1}
        onClick={() => setCrp(Math.min(totalPages, crp + 1))}
      >
        <ArrowRightCircleIcon className="size-9" />
      </Button>
    </section>
  );
}

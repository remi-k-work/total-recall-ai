// services, features, and other libraries
import { getInitialsFromName, getUserAvatarUrl } from "@/lib/helpers";

// components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/custom/avatar";

// assets
import { StarIcon } from "@heroicons/react/24/outline";

// types
import type { Testimonial } from "@/components/testimonial-slider/types";

interface SlideProps {
  testimonial: Testimonial;
}

export default function Slide({ testimonial: { stars, byWhom, testimonial } }: SlideProps) {
  return (
    <article className="bg-card rounded-[255px_15px_225px_15px_/_15px_225px_15px_255px] px-9 py-12 select-none">
      <header className="flex items-center gap-2">
        {[...Array(stars)].map((_, index) => (
          <StarIcon key={index} className="text-accent size-13" />
        ))}
      </header>
      <p className="mt-4 sm:text-xl">
        <Avatar className="float-left mr-4 mb-4 size-24 sm:size-32">
          <AvatarImage src={getUserAvatarUrl()} alt={byWhom} />
          <AvatarFallback className="text-4xl">{getInitialsFromName(byWhom)}</AvatarFallback>
        </Avatar>
        {testimonial}
      </p>
      <footer className="text-muted-foreground mt-4 text-end">{byWhom}</footer>
    </article>
  );
}

export function SlideSkeleton({ testimonial: { stars, byWhom, testimonial } }: SlideProps) {
  return (
    <article className="bg-card rounded-[255px_15px_225px_15px_/_15px_225px_15px_255px] px-9 py-12 select-none">
      <header className="flex items-center gap-2">
        {[...Array(stars)].map((_, index) => (
          <StarIcon key={index} className="text-accent size-13" />
        ))}
      </header>
      <p className="mt-4 sm:text-xl">
        <Avatar className="float-left mr-4 mb-4 size-24 sm:size-32">
          <AvatarImage src="https://robohash.org/placeholder.png" alt={byWhom} />
          <AvatarFallback className="text-4xl">{getInitialsFromName(byWhom)}</AvatarFallback>
        </Avatar>
        {testimonial}
      </p>
      <footer className="text-muted-foreground mt-4 text-end">{byWhom}</footer>
    </article>
  );
}

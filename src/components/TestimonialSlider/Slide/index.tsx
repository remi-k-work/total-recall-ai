// services, features, and other libraries
import { getInitialsFromName, getUserAvatarUrl } from "@/lib/helpers";

// components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/custom/avatar";

// assets
import { StarIcon } from "@heroicons/react/24/outline";

// types
import type { Testimonial } from "@/components/TestimonialSlider/types";

interface SlideProps {
  testimonial: Testimonial;
}

export default function Slide({ testimonial: { stars, byWhom, testimonial } }: SlideProps) {
  return (
    <article className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] bg-card px-9 py-12 select-none">
      <header className="flex items-center gap-2">
        {[...Array(stars)].map((_, index) => (
          <StarIcon key={index} className="size-13 text-accent" />
        ))}
      </header>
      <p className="mt-4 sm:text-xl">
        <Avatar className="float-left mr-4 mb-4 size-24 sm:size-32">
          <AvatarImage src={getUserAvatarUrl()} alt={byWhom} />
          <AvatarFallback className="text-4xl">{getInitialsFromName(byWhom)}</AvatarFallback>
        </Avatar>
        {testimonial}
      </p>
      <footer className="mt-4 text-end text-muted-foreground">{byWhom}</footer>
    </article>
  );
}

export function SlideSkeleton({ testimonial: { stars, byWhom, testimonial } }: SlideProps) {
  return (
    <article className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] bg-card px-9 py-12 select-none">
      <header className="flex items-center gap-2">
        {[...Array(stars)].map((_, index) => (
          <StarIcon key={index} className="size-13 text-accent" />
        ))}
      </header>
      <p className="mt-4 sm:text-xl">
        <Avatar className="float-left mr-4 mb-4 size-24 sm:size-32">
          <AvatarImage src="https://robohash.org/placeholder.png" alt={byWhom} />
          <AvatarFallback className="text-4xl">{getInitialsFromName(byWhom)}</AvatarFallback>
        </Avatar>
        {testimonial}
      </p>
      <footer className="mt-4 text-end text-muted-foreground">{byWhom}</footer>
    </article>
  );
}

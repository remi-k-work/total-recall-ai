"use client";

// react
import { Suspense } from "react";

// other libraries
import useEmblaCarousel from "embla-carousel-react";

// components
import Slide, { SlideSkeleton } from "./slide";
import Prev from "./buttons/Prev";
import Next from "./buttons/Next";
import Dot from "./buttons/Dot";

// constants
import { TESTIMONIALS } from "./constants";

export default function TestimonialSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel();

  return (
    <figure className="mx-auto w-full max-w-4xl">
      <article className="grid grid-cols-[auto_1fr] grid-rows-[1fr_auto] gap-y-4 [grid-template-areas:'viewport_viewport''prevnext_dots']">
        <section ref={emblaRef} className="overflow-hidden [grid-area:viewport]">
          <div className="-ms-4 flex touch-pan-y touch-pinch-zoom">
            {TESTIMONIALS.map((testimonial, index) => (
              <div key={index} className="min-w-0 shrink-0 grow-0 basis-full ps-4">
                <Suspense fallback={<SlideSkeleton testimonial={testimonial} />}>
                  <Slide testimonial={testimonial} />
                </Suspense>
              </div>
            ))}
          </div>
        </section>
        <header className="via-secondary flex items-center gap-4 bg-linear-to-b from-transparent to-transparent px-3 py-6 [grid-area:prevnext]">
          <Prev emblaApi={emblaApi} />
          <Next emblaApi={emblaApi} />
        </header>
        <footer className="via-secondary flex flex-wrap items-center justify-end gap-1 bg-linear-to-b from-transparent to-transparent px-3 py-6 [grid-area:dots]">
          {emblaApi?.scrollSnapList().map((_, index) => (
            <Dot key={index} emblaApi={emblaApi} index={index} />
          ))}
        </footer>
      </article>
    </figure>
  );
}

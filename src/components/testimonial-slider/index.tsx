"use client";

// other libraries
import useEmblaCarousel from "embla-carousel-react";

// components
import Slide from "./slide";
import Prev from "./buttons/Prev";
import Next from "./buttons/Next";
import Dot from "./buttons/Dot";

// constants
const TESTIMONIALS = [
  {
    stars: 5,
    byWhom: "Alex 'The Scribe' Johnson",
    testimonial:
      "I used to have 15 different note apps. Now I just have Total Recall AI and a lot more free time. It found a recipe idea I wrote down three years ago. Mind. Blown.",
  },
  {
    stars: 5,
    byWhom: "Dr. Evelyn Reed, Researcher",
    testimonial:
      "This thing is incredible for synthesizing research. I just dump all my papers and notes in, and I can ask it complex questions. It's like having a research assistant who never sleeps.",
  },
  {
    stars: 1,
    byWhom: "Barry M.",
    testimonial:
      "The app promised I'd never forget where I parked my car. And they lied! I asked it, and it said 'I have no record of you parking a car.' I was standing right next to it! Still got a ticket.",
  },
  {
    stars: 4,
    byWhom: "Stacy, College Student",
    testimonial:
      "Okay, so it didn't write my essay for me, but it found every single note, quote, and idea I had for it over the last six months. I aced my final. So... close enough!",
  },
  {
    stars: 5,
    byWhom: "Mark, Serial Brainstormer",
    testimonial:
      "My brain moves a mile a minute. I'd forget brilliant ideas 10 seconds after having them. Now, I just brain-dump into Total Recall AI, and my personal AI keeps it all organized. It's a game-changer.",
  },
  {
    stars: 2,
    byWhom: "Brenda 'Not-a-Tech-Person' Smith",
    testimonial:
      "It's very... powerful. A little *too* powerful? I asked it what I thought of my brother-in-law, and it pulled up a note from 2021 I *really* wish it hadn't. Be careful what you wish for.",
  },
  {
    stars: 5,
    byWhom: "Startup Sam",
    testimonial:
      "This is the 'second brain' concept finally done right. It's not just storage; it's an interactive partner. I'm pretty sure it's smarter than I am now.",
  },
  {
    stars: 3,
    byWhom: "Anonymous User",
    testimonial:
      "It's good, but it keeps suggesting I 'revisit my 2019 goals.' I don't want to, Total Recall AI! Stop reminding me I wanted to learn the banjo!",
  },
] as const;

export default function TestimonialSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel();

  return (
    <figure className="mx-auto w-full max-w-4xl">
      <article className="grid grid-cols-[auto_1fr] grid-rows-[1fr_auto] gap-4 [grid-template-areas:'viewport_viewport''prevnext_dots']">
        <section ref={emblaRef} className="overflow-hidden [grid-area:viewport]">
          <div className="-ms-4 flex touch-pan-y touch-pinch-zoom">
            {TESTIMONIALS.map((testimonial, index) => (
              <div key={index} className="min-w-0 shrink-0 grow-0 basis-full ps-4">
                <Slide testimonial={testimonial} />
              </div>
            ))}
          </div>
        </section>
        <header className="flex items-center gap-4 [grid-area:prevnext]">
          <Prev emblaApi={emblaApi} />
          <Next emblaApi={emblaApi} />
        </header>
        <footer className="flex flex-wrap items-center justify-end gap-1 [grid-area:dots]">
          {emblaApi?.scrollSnapList().map((_, index) => (
            <Dot key={index} emblaApi={emblaApi} index={index} />
          ))}
        </footer>
      </article>
    </figure>
  );
}

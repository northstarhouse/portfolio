"use client";

import { useEffect, useState } from "react";
import { SafeImage } from "@/components/safe-image";

type HeroSlideshowProps = {
  slides: Array<{
    src: string;
    alt: string;
  }>;
};

export function HeroSlideshow({ slides }: HeroSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const validSlides = slides.filter((slide) => slide.src);

  useEffect(() => {
    if (validSlides.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % validSlides.length);
    }, 4200);

    return () => window.clearInterval(interval);
  }, [validSlides.length]);

  if (validSlides.length === 0) {
    return (
      <div className="slideshow slideshow--empty" aria-label="Featured photography slideshow">
        <div className="slideshow__empty-state">
          Upload hero images in edit mode.
        </div>
      </div>
    );
  }

  return (
    <div className="slideshow" aria-label="Featured photography slideshow">
      {validSlides.map((slide, index) => (
        <div
          key={`${slide.src}-${index}`}
          className={`slide${index === activeIndex ? " active" : ""}`}
        >
          <SafeImage
            className="slide__image"
            fallbackClassName="slideshow__empty-state"
            fallbackLabel="Image unavailable"
            src={slide.src}
            alt={slide.alt}
            loading="eager"
            width={1400}
          />
        </div>
      ))}
    </div>
  );
}

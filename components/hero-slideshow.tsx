"use client";

import { useEffect, useState } from "react";

type HeroSlideshowProps = {
  slides: Array<{
    src: string;
    alt: string;
  }>;
};

export function HeroSlideshow({ slides }: HeroSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4200);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="slideshow" aria-label="Featured photography slideshow">
      {slides.map((slide, index) => (
        <div
          key={`${slide.src}-${index}`}
          className={`slide${index === activeIndex ? " active" : ""}`}
        >
          <img src={slide.src} alt={slide.alt} />
        </div>
      ))}
    </div>
  );
}

"use client";

type HeroSlideshowProps = {
  slides: Array<{
    src: string;
    alt: string;
  }>;
};

export function HeroSlideshow({ slides }: HeroSlideshowProps) {
  return (
    <div className="hero-slideshow" aria-label="Featured photography slideshow">
      {slides.map((slide, index) => (
        <figure
          key={`${slide.src}-${index}`}
          className="hero-slideshow__slide"
          style={{
            animationDelay: `${index * 6}s`
          }}
        >
          <img src={slide.src} alt={slide.alt} />
        </figure>
      ))}
      <div className="hero-slideshow__frame" />
    </div>
  );
}

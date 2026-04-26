"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CollectionItem = {
  tag: string;
  title: string;
  description: string;
  image: string;
  href: string;
};

type CollectionsCarouselProps = {
  collections: CollectionItem[];
};

function getVisibleCards(width: number) {
  if (width < 600) {
    return 1;
  }

  if (width < 900) {
    return 2;
  }

  return 3;
}

export function CollectionsCarousel({
  collections
}: CollectionsCarouselProps) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

  useEffect(() => {
    function syncViewport() {
      const nextVisibleCards = getVisibleCards(window.innerWidth);
      setVisibleCards(nextVisibleCards);
      setCarouselIndex((current) =>
        Math.min(current, Math.max(0, collections.length - nextVisibleCards))
      );
    }

    syncViewport();
    window.addEventListener("resize", syncViewport);

    return () => window.removeEventListener("resize", syncViewport);
  }, [collections.length]);

  const maxIndex = Math.max(0, collections.length - visibleCards);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCarouselIndex((current) => (current >= maxIndex ? 0 : current + 1));
    }, 7000);

    return () => window.clearInterval(interval);
  }, [maxIndex]);

  return (
    <div className="carousel-wrap">
      <div className="carousel-track-outer">
        <div
          className="carousel-track"
          style={{ transform: `translateX(calc(-${carouselIndex} * (360px + 28px)))` }}
        >
          {collections.map((collection) => (
            <article key={collection.title} className="card">
              <div className="card-img">
                <img src={collection.image} alt={collection.title} />
              </div>
              <div className="card-body">
                <span className="card-tag">{collection.tag}</span>
                <h3 className="card-title">{collection.title}</h3>
                <p className="card-desc">{collection.description}</p>
                <Link href={collection.href} className="card-btn">
                  View Collection
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="carousel-controls">
        <button
          className="carousel-arrow"
          aria-label="Previous collection"
          disabled={carouselIndex === 0}
          onClick={() => setCarouselIndex((current) => Math.max(0, current - 1))}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="carousel-dots">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              className={`dot${index === carouselIndex ? " active" : ""}`}
              aria-label={`Go to collection group ${index + 1}`}
              onClick={() => setCarouselIndex(index)}
            />
          ))}
        </div>

        <button
          className="carousel-arrow"
          aria-label="Next collection"
          disabled={carouselIndex >= maxIndex}
          onClick={() =>
            setCarouselIndex((current) => Math.min(maxIndex, current + 1))
          }
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

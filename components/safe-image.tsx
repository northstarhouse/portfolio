"use client";

import { useEffect, useState } from "react";

type SafeImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  fallbackLabel?: string;
};

export function SafeImage({
  src,
  alt,
  className,
  fallbackClassName,
  fallbackLabel = "Image unavailable"
}: SafeImageProps) {
  const [failed, setFailed] = useState(!src);

  useEffect(() => {
    setFailed(!src);
  }, [src]);

  if (failed) {
    return (
      <div className={fallbackClassName ?? className}>
        <span>{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <img
      className={className}
      src={src ?? ""}
      alt={alt}
      onError={() => setFailed(true)}
    />
  );
}

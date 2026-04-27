"use client";

import { useEffect, useState } from "react";
import { optimizeImageUrl } from "@/lib/image";

type SafeImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  fallbackLabel?: string;
  loading?: "lazy" | "eager";
  width?: number;
};

export function SafeImage({
  src,
  alt,
  className,
  fallbackClassName,
  fallbackLabel = "Image unavailable",
  loading = "lazy",
  width
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

  const resolvedSrc = src && width ? optimizeImageUrl(src, width) : (src ?? "");

  return (
    <img
      className={className}
      src={resolvedSrc}
      alt={alt}
      loading={loading}
      onError={() => setFailed(true)}
    />
  );
}

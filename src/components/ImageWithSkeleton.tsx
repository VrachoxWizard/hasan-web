"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

// Static blue-tinted placeholder - matches the site's color scheme
// This is a tiny 10x10 gradient that gets stretched and blurred by Next.js
const DEFAULT_BLUR_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMWUzYTVmO3N0b3Atb3BhY2l0eToxIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMmQ1YTg3O3N0b3Atb3BhY2l0eToxIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+";

interface ImageWithSkeletonProps
  extends Omit<ImageProps, "onLoad" | "placeholder" | "blurDataURL"> {
  skeletonClassName?: string;
  blurDataURL?: string;
  useBlurPlaceholder?: boolean;
}

export default function ImageWithSkeleton({
  className,
  skeletonClassName,
  blurDataURL,
  useBlurPlaceholder = true,
  alt,
  ...props
}: ImageWithSkeletonProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Use provided blurDataURL, or fall back to default blue placeholder
  const placeholderUrl = blurDataURL || DEFAULT_BLUR_PLACEHOLDER;

  return (
    <div className="relative w-full h-full">
      {/* Skeleton with shimmer - shows while loading */}
      {isLoading && (
        <div
          className={cn(
            "absolute inset-0 bg-muted animate-pulse",
            skeletonClassName
          )}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
        </div>
      )}

      {/* Image with blur placeholder */}
      <Image
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        alt={alt}
        placeholder={useBlurPlaceholder ? "blur" : "empty"}
        blurDataURL={useBlurPlaceholder ? placeholderUrl : undefined}
        onLoad={() => setIsLoading(false)}
        {...props}
      />
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";

type LazyMapProps = {
  src: string;
  title: string;
  minHeight?: string;
  className?: string;
};

/**
 * Defers loading of a heavy map iframe until it is near the viewport.
 * Reduces initial network/JS work for landing pages.
 */
export default function LazyMap({
  src,
  title,
  minHeight = "450px",
  className,
}: LazyMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!containerRef.current || shouldLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div
      ref={containerRef}
      className={cn("w-full h-full", className)}
      style={{ minHeight }}
    >
      {shouldLoad ? (
        hasError ? (
          <div
            className="w-full h-full bg-muted rounded-2xl flex flex-col items-center justify-center p-6 text-center"
            style={{ minHeight }}
          >
            <MapPin className="w-12 h-12 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              Unable to load map. Please try again later.
            </p>
          </div>
        ) : (
          <iframe
            src={src}
            width="100%"
            height="100%"
            style={{ border: 0, minHeight }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={title}
            onError={() => setHasError(true)}
          />
        )
      ) : (
        <div
          className="w-full h-full bg-muted animate-pulse rounded-2xl"
          aria-label={`Loading ${title}`}
          style={{ minHeight }}
        />
      )}
    </div>
  );
}

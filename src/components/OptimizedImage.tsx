"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<ImageProps, "onLoad" | "onError"> {
  className?: string;
}

export default function OptimizedImage({
  className,
  alt,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Image
      {...props}
      alt={alt}
      className={cn(
        "transition-opacity duration-300",
        isLoaded ? "opacity-100" : "opacity-0",
        className
      )}
      onLoad={() => setIsLoaded(true)}
      loading={props.priority ? undefined : "lazy"}
      quality={85}
    />
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, Hand } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const t = useTranslations("gallery");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showZoomHint, setShowZoomHint] = useState(false);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "Escape") setIsLightboxOpen(false);
  };

  const openLightbox = () => {
    setIsLightboxOpen(true);

    // Show zoom hint (mobile only, once per device)
    if (typeof window === "undefined") return;
    const isMobile = window.innerWidth < 1024;
    if (!isMobile) return;

    try {
      const hintShown = localStorage.getItem("zoom-hint-shown");
      if (hintShown) return;

      setShowZoomHint(true);
      window.setTimeout(() => {
        setShowZoomHint(false);
        localStorage.setItem("zoom-hint-shown", "true");
      }, 3000);
    } catch {
      // Ignore storage errors (private mode, blocked storage, etc.)
    }
  };

  // Focus trap and scroll lock effect
  useEffect(() => {
    if (isLightboxOpen) {
      // Save current active element
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Lock scroll
      document.body.style.overflow = "hidden";

      // Focus close button
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);

      // Focus trap handler
      const handleFocusTrap = (e: KeyboardEvent) => {
        if (e.key !== "Tab") return;

        const lightbox = lightboxRef.current;
        if (!lightbox) return;

        const focusableElements = lightbox.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      };

      document.addEventListener("keydown", handleFocusTrap);

      return () => {
        document.removeEventListener("keydown", handleFocusTrap);
        document.body.style.overflow = "";
        previousActiveElement.current?.focus();
      };
    }
  }, [isLightboxOpen]);

  return (
    <>
      {/* Main Gallery */}
      <div className="relative rounded-2xl overflow-hidden bg-muted">
        <div
          className="aspect-[16/10] relative cursor-zoom-in group"
          onClick={openLightbox}
        >
          <Image
            src={images[currentIndex]}
            alt={`${alt} - ${t("image")} ${currentIndex + 1}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />

          {/* Zoom indicator */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
            <div className="bg-white/90 dark:bg-card/90 rounded-full p-3">
              <ZoomIn className="w-6 h-6 text-accent" />
            </div>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/90 hover:bg-white dark:bg-card/90 dark:hover:bg-card flex items-center justify-center shadow-lg transition-all"
                aria-label={t("previousImage")}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/90 hover:bg-white dark:bg-card/90 dark:hover:bg-card flex items-center justify-center shadow-lg transition-all"
                aria-label={t("nextImage")}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails - Keyboard navigable with scroll arrows */}
        {images.length > 1 && (
          <div className="relative">
            {/* Scroll arrows for many images */}
            {images.length > 5 && (
              <>
                <button
                  onClick={() =>
                    thumbnailsRef.current?.scrollBy({
                      left: -150,
                      behavior: "smooth",
                    })
                  }
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white dark:bg-card/90 dark:hover:bg-card flex items-center justify-center shadow-lg transition-all"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    thumbnailsRef.current?.scrollBy({
                      left: 150,
                      behavior: "smooth",
                    })
                  }
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white dark:bg-card/90 dark:hover:bg-card flex items-center justify-center shadow-lg transition-all"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
            <div
              ref={thumbnailsRef}
              className="flex gap-2 p-3 bg-card overflow-x-auto scroll-smooth snap-x snap-mandatory"
              role="tablist"
              aria-label={t("imageGallery")}
              style={{ scrollbarWidth: "thin" }}
            >
              {images.map((slika, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setCurrentIndex(index);
                    }
                  }}
                  role="tab"
                  aria-selected={index === currentIndex}
                  aria-label={t("imageOf", {
                    current: index + 1,
                    total: images.length,
                  })}
                  tabIndex={index === currentIndex ? 0 : -1}
                  className={`relative w-20 h-14 min-w-[80px] rounded-lg overflow-hidden shrink-0 transition-all snap-start ${
                    index === currentIndex
                      ? "ring-2 ring-accent"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={slika}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            ref={lightboxRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setIsLightboxOpen(false)}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            aria-label={t("imageGallery")}
            aria-describedby="lightbox-description"
          >
            {/* ARIA live region for screen readers */}
            <div
              className="sr-only"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {t("imageOf", {
                current: currentIndex + 1,
                total: images.length,
              })}
            </div>

            {/* Zoom Hint - Mobile only */}
            <AnimatePresence>
              {showZoomHint && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none z-50"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: 3, duration: 1 }}
                    className="flex flex-col items-center gap-3 text-white"
                  >
                    <Hand className="w-12 h-12" />
                    <p className="text-lg font-semibold">Pinch to zoom</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Close button */}
            <Button
              ref={closeButtonRef}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/10 z-10"
              onClick={() => setIsLightboxOpen(false)}
              aria-label={t("closeGallery")}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 w-12 h-12"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  aria-label={t("previousImage")}
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 w-12 h-12"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  aria-label={t("nextImage")}
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </>
            )}

            {/* Image */}
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full max-w-6xl max-h-[85vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[currentIndex]}
                alt={`${alt} - ${t("image")} ${currentIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Thumbnail strip - Hidden on mobile, keyboard navigable on desktop */}
            {images.length > 1 && (
              <div
                className="absolute bottom-16 left-1/2 -translate-x-1/2 hidden sm:flex gap-2 p-2 bg-black/50 rounded-lg backdrop-blur-sm max-w-[90vw] overflow-x-auto"
                role="tablist"
                aria-label={t("galleryNavigation")}
              >
                {images.map((slika, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(index);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentIndex(index);
                      }
                    }}
                    role="tab"
                    aria-selected={index === currentIndex}
                    aria-label={t("showImage", { number: index + 1 })}
                    tabIndex={0}
                    className={`relative w-16 h-10 rounded overflow-hidden transition-all ${
                      index === currentIndex
                        ? "ring-2 ring-accent"
                        : "opacity-50 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={slika}
                      alt={`${alt} - ${t("image")} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

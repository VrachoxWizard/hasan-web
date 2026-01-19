"use client";

import * as React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Car, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const heroSlides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&auto=format&fit=crop&q=80",
    alt: "Luksuzni automobil u showroomu",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&auto=format&fit=crop&q=80",
    alt: "Sportski automobil na cesti",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1920&auto=format&fit=crop&q=80",
    alt: "Premium vozilo u prirodi",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1920&auto=format&fit=crop&q=80",
    alt: "Moderno vozilo u salonu",
  },
];

interface HeroCarouselProps {
  children?: React.ReactNode;
}

export default function HeroCarousel({ children }: HeroCarouselProps) {
  const t = useTranslations("hero");
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = React.useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative">
      {/* Carousel Container */}
      <div
        className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden"
        ref={emblaRef}
      >
        <div className="flex h-full">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className="relative flex-[0_0_100%] min-w-0 h-full"
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
            </div>
          ))}
        </div>

        {/* CTA Buttons - Centered on carousel */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-8 sm:gap-16 px-4"
          >
            <Link href="/vozila" className="group">
              <motion.div
                animate={{
                  scale: [1, 1.02, 1],
                  boxShadow: [
                    "0 15px 40px rgba(255, 255, 255, 0.2)",
                    "0 18px 50px rgba(255, 255, 255, 0.3)",
                    "0 15px 40px rgba(255, 255, 255, 0.2)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Button
                  size="lg"
                  className="relative w-full min-w-0 min-[400px]:min-w-[240px] sm:min-w-[280px] h-14 sm:h-[70px] text-base sm:text-xl font-extrabold bg-white text-primary hover:bg-white/95 shadow-[0_0_25px_rgba(255,255,255,0.5)] transition-all duration-300 border-4 sm:border-[6px] border-white/90 group-hover:border-white overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  <Car className="w-5 h-5 sm:w-7 sm:h-7 mr-2 sm:mr-3 relative z-10 group-hover:rotate-12 transition-transform" />
                  <span className="relative z-10 tracking-widest drop-shadow-lg">
                    {t("availableVehicles")}
                  </span>
                </Button>
              </motion.div>
            </Link>
            <Link href="/kontakt" className="group">
              <motion.div
                animate={{
                  scale: [1, 1.02, 1],
                  boxShadow: [
                    "0 15px 40px rgba(255, 255, 255, 0.2)",
                    "0 18px 50px rgba(255, 255, 255, 0.3)",
                    "0 15px 40px rgba(255, 255, 255, 0.2)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5,
                }}
              >
                <Button
                  size="lg"
                  className="relative w-full min-w-0 min-[400px]:min-w-[240px] sm:min-w-[280px] h-14 sm:h-[70px] text-base sm:text-xl font-extrabold bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-primary shadow-[0_0_25px_rgba(255,255,255,0.5)] transition-all duration-300 border-4 sm:border-[6px] border-white group-hover:border-white/90 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  <Building2 className="w-5 h-5 sm:w-7 sm:h-7 mr-2 sm:mr-3 relative z-10 group-hover:rotate-12 transition-transform" />
                  <span className="relative z-10 tracking-widest drop-shadow-lg">
                    {t("wholesale")}
                  </span>
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>

        {/* Navigation arrows */}
        <div className="absolute inset-0 z-20 pointer-events-none hidden md:flex items-center justify-between px-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={cn(
              "pointer-events-auto h-12 w-12 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-sm border border-white/20",
              !canScrollPrev && "opacity-50"
            )}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={cn(
              "pointer-events-auto h-12 w-12 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-sm border border-white/20",
              !canScrollNext && "opacity-50"
            )}
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Pagination dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => scrollTo(index)}
              className={cn(
                "h-2.5 rounded-full transition-all bg-white/50 hover:bg-white",
                selectedIndex === index ? "w-8 bg-white" : "w-2.5"
              )}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={selectedIndex === index ? "true" : undefined}
            />
          ))}
        </div>
      </div>

      {/* Search Form Overlay - positioned to overlap bottom of carousel and top of next section */}
      {children && (
        <div className="relative z-30 -mt-16 md:-mt-12 px-4">
          <div className="container mx-auto max-w-7xl">{children}</div>
        </div>
      )}
    </section>
  );
}

"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamic import for QuickViewModal to reduce initial bundle
const QuickViewModal = dynamic(() => import("@/components/QuickViewModal"), {
  ssr: false,
});
import {
  Fuel,
  Gauge,
  Calendar,
  Settings,
  GitCompare,
  Check,
  Heart,
  ImageIcon,
  Eye,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Vozilo } from "@/types/vozilo";
import {
  formatKilometraza,
} from "@/lib/vozila";
import { useUsporediStore } from "@/stores/usporediStore";
import { useFavoritiStore } from "@/stores/favoritiStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import TrustBadges from "@/components/TrustBadges";
import PriceDisplay from "@/components/PriceDisplay";
import PriceDropBadge from "@/components/PriceDropBadge";
import { typography, spacing, components, badges } from "@/lib/designTokens";

interface VoziloCardProps {
  vozilo: Vozilo;
  index?: number;
  priority?: boolean;
}

export default function VoziloCard({
  vozilo,
  index = 0,
  priority = false,
}: VoziloCardProps) {
  const t = useTranslations("vehicles");
  const { addVozilo, removeVozilo, isInList } = useUsporediStore();
  const { toggleFavorit, isFavorit } = useFavoritiStore();
  const isComparing = isInList(vozilo.id);
  const isFav = isFavorit(vozilo.id);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleCompareToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (isComparing) {
        removeVozilo(vozilo.id);
        toast.info(
          `${vozilo.marka} ${vozilo.model} ${t("removedFromCompare")}`
        );
      } else {
        const success = addVozilo(vozilo);
        if (success) {
          toast.success(
            `${vozilo.marka} ${vozilo.model} ${t("addedToCompare")}`
          );
        } else {
          toast.error(t("maxCompare"));
        }
      }
    },
    [isComparing, removeVozilo, vozilo, addVozilo, t]
  );

  const handleFavoritToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const added = toggleFavorit(vozilo);
      if (added) {
        toast.success(
          `${vozilo.marka} ${vozilo.model} ${t("addedToFavorites")}`
        );
      } else {
        toast.info(
          `${vozilo.marka} ${vozilo.model} ${t("removedFromFavorites")}`
        );
      }
    },
    [toggleFavorit, vozilo, t]
  );

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "100px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Card
        className={`${components.card.default} group relative overflow-hidden h-full rounded-3xl border border-border bg-card shadow-lg shadow-black/10 dark:shadow-black/30 will-change-transform hover:ring-2 hover:ring-accent/50 hover:scale-[1.02] transition-all duration-300 ease-out`}
      >
        <div className="relative">
          <Link
            href={`/vozila/${vozilo.id}`}
            className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              {/* Skeleton loader */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-muted animate-pulse">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
                </div>
              )}

              {/* Image Error State - Styled empty state with icon */}
              {imageError && (
              <div className="absolute inset-0 bg-muted flex flex-col items-center justify-center gap-3">
                <div
                  className={`w-16 h-16 rounded-2xl ${components.icon.background} flex items-center justify-center`}
                >
                  <ImageIcon className={`w-8 h-8 ${components.icon.accent}`} />
                </div>
                <p
                  className={`${typography.small} text-muted-foreground text-center px-4`}
                >
                  {t("imageNotAvailable")}
                </p>
              </div>
              )}

              {/* Vehicle Image */}
              {!imageError && (
                <Image
                  src={vozilo.slike[0]}
                alt={`${vozilo.marka} ${vozilo.model} (${
                  vozilo.godina
                }) - ${formatKilometraza(vozilo.kilometraza)}`}
                fill
                className={cn(
                  "object-cover transition-all duration-300 group-hover:scale-110 will-change-transform",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={priority}
                loading={priority ? "eager" : "lazy"}
                quality={85}
                onLoad={() => setImageLoaded(true)}
                onError={handleImageError}
              />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Badges - Fixed positioning to prevent overlap on small screens */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
              {vozilo.ekskluzivno && (
                <Badge className={badges.ekskluzivno}>
                  {t("card.exclusive")}
                </Badge>
              )}
              {vozilo.istaknuto && !vozilo.ekskluzivno && (
                <Badge className={badges.istaknuto}>{t("card.featured")}</Badge>
              )}
            </div>

            {/* Price Drop Badge */}
            {vozilo.staracijena && (
              <PriceDropBadge
                originalPrice={vozilo.staracijena}
                currentPrice={vozilo.cijena}
              />
            )}

            {/* Quick View Overlay - Desktop only */}
            <div className="hidden lg:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity duration-300 z-20 pointer-events-none">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold shadow-xl pointer-events-auto"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsQuickViewOpen(true);
                }}
              >
                <Eye className="w-5 h-5 mr-2" />
                {t("quickViewButton")}
              </Button>
            </div>

            {/* Price Tag - Using PriceDisplay component */}
            <div className="absolute bottom-3 left-3 z-10">
              <PriceDisplay
                price={vozilo.cijena}
                oldPrice={vozilo.staracijena}
                variant="card"
              />
            </div>
            </div>
          </Link>

          {/* Action Buttons - Improved touch targets (44x44px) */}
          <div className="absolute top-3 right-3 z-30 flex gap-2">
            {/* Favorites Button */}
            <motion.div
              animate={isFav ? { scale: [1, 1.3, 1] } : {}}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Button
                size="icon"
                variant="secondary"
                className={`transition-all shadow-md min-w-[44px] min-h-[44px] ${
                  isFav
                    ? "bg-favorite text-favorite-foreground hover:bg-favorite/90"
                    : "bg-white/90 hover:bg-white text-muted-foreground dark:bg-card/90 dark:hover:bg-card dark:text-foreground"
                }`}
                onClick={handleFavoritToggle}
                aria-label={
                  isFav
                    ? t("card.removeFromFavorites")
                    : t("card.addToFavorites")
                }
                aria-pressed={isFav}
              >
                <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
              </Button>
            </motion.div>

            {/* Compare Button */}
            <Button
              size="icon"
              variant={isComparing ? "default" : "secondary"}
              className={`transition-all shadow-md min-w-[44px] min-h-[44px] ${
                isComparing
                  ? "bg-accent text-accent-foreground hover:bg-accent/90"
                  : "bg-white/90 hover:bg-white text-muted-foreground dark:bg-card/90 dark:hover:bg-card dark:text-foreground"
              }`}
              onClick={handleCompareToggle}
              aria-label={
                isComparing ? t("removeFromCompare") : t("addToCompare")
              }
              aria-pressed={isComparing}
            >
              {isComparing ? (
                <Check className="w-4 h-4" />
              ) : (
                <GitCompare className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <CardContent className={`${spacing.card.small} bg-card`}>
          <Link
            href={`/vozila/${vozilo.id}`}
            className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <h3
              className={`${typography.h4} text-foreground group-hover:text-accent transition-colors`}
            >
              {vozilo.marka} {vozilo.model}
            </h3>
          </Link>

          {/* Trust badges - only for featured vehicles */}
          {vozilo.istaknuto && (
            <div className="mt-2">
              <TrustBadges size="sm" />
            </div>
          )}

          {/* Vehicle Metadata - Using design tokens for consistency */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className={components.metadata.container}>
              <Calendar className={components.metadata.icon} />
              <span className={components.metadata.text}>{vozilo.godina}</span>
            </div>
            <div className={components.metadata.container}>
              <Gauge className={components.metadata.icon} />
              <span className={components.metadata.text}>
                {formatKilometraza(vozilo.kilometraza)}
              </span>
            </div>
            <div className={components.metadata.container}>
              <Fuel className={components.metadata.icon} />
              <span className={components.metadata.text}>
                {t(`fuel.${vozilo.gorivo}`)}
              </span>
            </div>
            <div className={components.metadata.container}>
              <Settings className={components.metadata.icon} />
              <span className={components.metadata.text}>
                {t(`transmission.${vozilo.mjenjac}`)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick View Modal */}
      <QuickViewModal
        vozilo={vozilo}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </motion.div>
  );
}

"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Fuel,
  Gauge,
  Calendar,
  Settings,
  GitCompare,
  Check,
  Heart,
  ChevronRight,
  ImageIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TrustBadges from "@/components/TrustBadges";
import PriceDisplay from "@/components/PriceDisplay";
import { Vozilo } from "@/types/vozilo";
import { formatKilometraza } from "@/lib/vozila";
import { useUsporediStore } from "@/stores/usporediStore";
import { useFavoritiStore } from "@/stores/favoritiStore";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { typography, components, badges } from "@/lib/designTokens";

interface VoziloListItemProps {
  vozilo: Vozilo;
  index?: number;
}

export default function VoziloListItem({
  vozilo,
  index = 0,
}: VoziloListItemProps) {
  const t = useTranslations("vehicles");
  const { addVozilo, removeVozilo, isInList } = useUsporediStore();
  const { toggleFavorit, isFavorit } = useFavoritiStore();
  const isComparing = isInList(vozilo.id);
  const isFav = isFavorit(vozilo.id);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isComparing) {
      removeVozilo(vozilo.id);
      toast.info(
        t("removedFromCompare", { brand: vozilo.marka, model: vozilo.model })
      );
    } else {
      const success = addVozilo(vozilo);
      if (success) {
        toast.success(
          t("card.addedToCompare", { brand: vozilo.marka, model: vozilo.model })
        );
      } else {
        toast.error(t("card.maxCompareReached"));
      }
    }
  };

  const handleFavoritToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const added = toggleFavorit(vozilo);
    if (added) {
      toast.success(
        t("addedToFavorites", { brand: vozilo.marka, model: vozilo.model })
      );
    } else {
      toast.info(
        t("removedFromFavorites", { brand: vozilo.marka, model: vozilo.model })
      );
    }
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card className={`${components.card.elevated} group overflow-hidden relative`}>
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative w-full sm:w-64 md:w-80 shrink-0 aspect-[16/10] sm:aspect-auto sm:h-48 dark:ring-1 dark:ring-white/10">
            <Link
              href={`/vozila/${vozilo.id}`}
              className="block w-full h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {/* Skeleton loader */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-muted animate-pulse">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
                </div>
              )}

              {/* Image Error State */}
              {imageError && (
                <div className="absolute inset-0 bg-muted flex flex-col items-center justify-center gap-2">
                  <div
                    className={`w-12 h-12 rounded-xl ${components.icon.background} flex items-center justify-center`}
                  >
                    <ImageIcon
                      className={`w-6 h-6 ${components.icon.accent}`}
                    />
                  </div>
                  <p className={`${typography.tiny} text-muted-foreground`}>
                    {t("imageNotAvailable")}
                  </p>
                </div>
              )}

              {!imageError && (
                <Image
                  src={vozilo.slike[0]}
                  alt={`${vozilo.marka} ${vozilo.model} (${vozilo.godina}) - ${formatKilometraza(vozilo.kilometraza)}`}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-500 group-hover:scale-105",
                    imageLoaded ? "opacity-100" : "opacity-0"
                  )}
                  sizes="(max-width: 640px) 100vw, 320px"
                  onLoad={() => setImageLoaded(true)}
                  onError={handleImageError}
                />
              )}

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {vozilo.ekskluzivno && (
                  <Badge className={badges.ekskluzivno}>
                    {t("card.exclusive")}
                  </Badge>
                )}
                {vozilo.istaknuto && !vozilo.ekskluzivno && (
                  <Badge className={badges.istaknuto}>
                    {t("card.featured")}
                  </Badge>
                )}
              </div>
            </Link>

            {/* Action Buttons - Improved touch targets */}
            <div className="absolute top-3 right-3 z-20 flex gap-2">
              <Button
                size="icon"
                variant="outline"
                className={`transition-all min-w-[44px] min-h-[44px] ${
                  isFav
                    ? "bg-favorite text-favorite-foreground border-favorite hover:bg-favorite/90"
                    : "hover:border-favorite/50 dark:hover:border-favorite/40"
                }`}
                onClick={handleFavoritToggle}
                aria-label={
                  isFav ? t("card.removeFromFavorites") : t("card.addToFavorites")
                }
                aria-pressed={isFav}
              >
                <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
              </Button>
              <Button
                size="icon"
                variant={isComparing ? "default" : "outline"}
                className={`transition-all min-w-[44px] min-h-[44px] ${
                  isComparing ? "bg-accent text-white hover:bg-accent/90" : ""
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

          {/* Content */}
          <div className="flex-1 p-4 sm:p-5 flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/vozila/${vozilo.id}`}
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
                  >
                    <h3
                      className={`${typography.h4} text-foreground group-hover:text-primary transition-colors`}
                    >
                      {vozilo.marka} {vozilo.model}
                    </h3>
                  </Link>
                  {vozilo.istaknuto && <TrustBadges size="sm" />}
                </div>
                <PriceDisplay
                  price={vozilo.cijena}
                  oldPrice={vozilo.staracijena}
                  variant="list"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Specs - Using design tokens */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
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

            {/* Description preview & CTA */}
            <div className="mt-auto pt-4 flex items-end justify-between gap-4">
              <p
                className={`${typography.small} text-muted-foreground line-clamp-2 hidden md:block flex-1`}
              >
                {vozilo.opis}
              </p>
              <Link href={`/vozila/${vozilo.id}`}>
                <Button
                  variant="ghost"
                  className="text-accent hover:text-accent/80 shrink-0"
                >
                  {t("listView.details")}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

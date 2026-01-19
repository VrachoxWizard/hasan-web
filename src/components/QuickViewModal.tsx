"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Gauge,
  Fuel,
  Settings,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  GitCompare,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Vozilo } from "@/types/vozilo";
import {
  formatCijena,
  formatKilometraza,
} from "@/lib/vozila";
import PriceDisplay from "@/components/PriceDisplay";
import { useUsporediStore } from "@/stores/usporediStore";
import { toast } from "sonner";
import { typography, components } from "@/lib/designTokens";
import { useTranslations } from "next-intl";

interface QuickViewModalProps {
  vozilo: Vozilo;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({
  vozilo,
  isOpen,
  onClose,
}: QuickViewModalProps) {
  const t = useTranslations("vehicles");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addVozilo, isInList } = useUsporediStore();
  const isComparing = isInList(vozilo.id);

  // Show only first 5 images to encourage full page visit
  const previewImages = vozilo.slike.slice(0, 5);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === previewImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? previewImages.length - 1 : prev - 1
    );
  };

  const handleAddToCompare = () => {
    if (!isComparing) {
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

  // Reset image index when modal opens
  useEffect(() => {
    if (!isOpen) return;
    const id = requestAnimationFrame(() => setCurrentImageIndex(0));
    return () => cancelAnimationFrame(id);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[calc(100%-2rem)] sm:max-w-xl md:max-w-2xl lg:max-w-4xl max-h-[calc(100dvh-4rem)] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className={typography.h3}>
            {vozilo.marka} {vozilo.model} ({vozilo.godina})
          </DialogTitle>
        </DialogHeader>

        {/* Image Carousel */}
        <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-muted">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              <Image
                src={previewImages[currentImageIndex]}
                alt={`${vozilo.marka} ${vozilo.model} - Slika ${
                  currentImageIndex + 1
                }`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          {previewImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white dark:bg-card/90 dark:hover:bg-card flex items-center justify-center shadow-lg transition-all z-10"
                aria-label={t("detail.previousImage")}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white dark:bg-card/90 dark:hover:bg-card flex items-center justify-center shadow-lg transition-all z-10"
                aria-label={t("detail.nextImage")}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {previewImages.length}
            {vozilo.slike.length > 5 && (
              <span className="text-white/70">
                {" "}
                (+{vozilo.slike.length - 5} {t("quickView.moreImages")})
              </span>
            )}
          </div>
        </div>

        {/* Price Display */}
        <div className="flex items-center justify-between py-4 border-y border-border">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              {t("quickView.price")}
            </p>
            <PriceDisplay
              price={vozilo.cijena}
              oldPrice={vozilo.staracijena}
              variant="detail"
            />
          </div>
          {vozilo.staracijena && vozilo.staracijena > vozilo.cijena && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                {t("card.savings")}
              </p>
              <p className="text-xl font-bold text-success">
                {formatCijena(vozilo.staracijena - vozilo.cijena)}
              </p>
            </div>
          )}
        </div>

        {/* Key Specifications Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={components.metadata.container}>
            <Calendar className={components.metadata.icon} />
            <div>
              <p className="text-xs text-muted-foreground">{t("card.year")}</p>
              <p className="font-semibold">{vozilo.godina}</p>
            </div>
          </div>
          <div className={components.metadata.container}>
            <Gauge className={components.metadata.icon} />
            <div>
              <p className="text-xs text-muted-foreground">
                {t("card.mileage")}
              </p>
              <p className="font-semibold">
                {formatKilometraza(vozilo.kilometraza)}
              </p>
            </div>
          </div>
          <div className={components.metadata.container}>
            <Fuel className={components.metadata.icon} />
            <div>
              <p className="text-xs text-muted-foreground">
                {t("quickView.fuel")}
              </p>
              <p className="font-semibold">{t(`fuel.${vozilo.gorivo}`)}</p>
            </div>
          </div>
          <div className={components.metadata.container}>
            <Settings className={components.metadata.icon} />
            <div>
              <p className="text-xs text-muted-foreground">
                {t("quickView.transmission")}
              </p>
              <p className="font-semibold">
                {t(`transmission.${vozilo.mjenjac}`)}
              </p>
            </div>
          </div>
        </div>

        {/* Description Preview */}
        <div>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {vozilo.opis}
          </p>
        </div>

        {/* Action Buttons */}
        <DialogFooter className="flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={handleAddToCompare}
            disabled={isComparing}
            className="w-full sm:w-auto"
          >
            <GitCompare className="w-4 h-4 mr-2" />
            {isComparing
              ? t("quickView.inComparison")
              : t("quickView.addToCompare")}
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href={`/vozila/${vozilo.id}`}>
              {t("quickView.viewAllDetails")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

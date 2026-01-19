"use client";

import { motion } from "framer-motion";
import { Heart, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import VoziloCard from "@/components/VoziloCard";
import PageSkeleton from "@/components/PageSkeleton";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/PageTransition";
import { useFavoritiStore } from "@/stores/favoritiStore";
import { typography, spacing, components } from "@/lib/designTokens";

export default function FavoritiClient() {
  const favoriti = useFavoritiStore((state) => state.favoriti);
  const clearFavoriti = useFavoritiStore((state) => state.clearFavoriti);
  const hasHydrated = useFavoritiStore((state) => state.hasHydrated);
  const t = useTranslations("favorites");

  if (!hasHydrated) {
    return <PageSkeleton />;
  }

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Heart
                className={`w-8 h-8 text-favorite fill-favorite ${components.icon.accent}`}
              />
              <div>
                <h1 className={`${typography.h2} text-foreground`}>
                  {t("pageTitle")}
                </h1>
                <p className={`${typography.body} text-muted-foreground`}>
                  {favoriti.length === 0
                    ? t("emptyTitle")
                    : t("vehicleCount", { count: favoriti.length })}
                </p>
              </div>
            </div>

            {favoriti.length > 0 && (
              <Button
                variant="outline"
                onClick={clearFavoriti}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t("clearAll")}
              </Button>
            )}
          </div>
        </FadeIn>

        {favoriti.length === 0 ? (
          <FadeIn>
            <div className="text-center py-16">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="w-24 h-24 mx-auto text-muted-foreground/30 mb-6" />
              </motion.div>
              <h2 className={`${typography.h3} text-foreground mb-2`}>
                {t("emptyTitle")}
              </h2>
              <p
                className={`${typography.body} text-muted-foreground max-w-md mx-auto mb-8`}
              >
                {t("emptyDescription")}
              </p>
              <Link href="/vozila">
                <Button size="lg" className={components.button.primary}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t("browseVehicles")}
                </Button>
              </Link>
            </div>
          </FadeIn>
        ) : (
          <StaggerContainer
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${spacing.gap.default}`}
          >
            {favoriti.map((vozilo) => (
              <StaggerItem key={vozilo.id}>
                <VoziloCard vozilo={vozilo} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {favoriti.length > 0 && (
          <FadeIn>
            <div className="mt-8 text-center">
              <Link href="/vozila">
                <Button variant="outline" size="lg">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t("backToVehicles")}
                </Button>
              </Link>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}

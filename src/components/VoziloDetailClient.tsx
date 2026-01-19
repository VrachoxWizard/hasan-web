"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import {
  ArrowLeft,
  Calendar,
  Fuel,
  Gauge,
  Palette,
  Settings,
  Zap,
  Heart,
  GitCompare,
  Phone,
  MessageCircle,
  Check,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ImageGallery from "@/components/ImageGallery";
import dynamic from "next/dynamic";
import PriceDisplay from "@/components/PriceDisplay";
import { typography, spacing, components } from "@/lib/designTokens";
import { formatCijena, formatKilometraza } from "@/lib/vozila";
import { CONTACT } from "@/lib/constants";
import { useFavoritiStore } from "@/stores/favoritiStore";
import { useUsporediStore } from "@/stores/usporediStore";
import type { Vozilo } from "@/types/vozilo";
import { toast } from "sonner";
import KalkulatorFinanciranja from "@/components/KalkulatorFinanciranja";

const RecentlyViewed = dynamic(() => import("@/components/RecentlyViewed"), {
  ssr: false,
});

type Spec = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
};

export default function VoziloDetailClient({ vozilo }: { vozilo: Vozilo }) {
  const tVehicles = useTranslations("vehicles");
  const tCommon = useTranslations("common");
  const tCompare = useTranslations("compare");

  const hasHydrated = useFavoritiStore((state) => state.hasHydrated);
  const addRecentlyViewed = useFavoritiStore(
    (state) => state.addRecentlyViewed
  );
  const isFavorit = useFavoritiStore((state) => state.isFavorit);
  const toggleFavorit = useFavoritiStore((state) => state.toggleFavorit);

  const isInList = useUsporediStore((state) => state.isInList);
  const addVozilo = useUsporediStore((state) => state.addVozilo);
  const removeVozilo = useUsporediStore((state) => state.removeVozilo);

  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    addRecentlyViewed(vozilo.id);
  }, [hasHydrated, addRecentlyViewed, vozilo.id]);

  const handleFavoriteClick = () => {
    const added = toggleFavorit(vozilo);
    toast.success(
      added
        ? tVehicles("addedToFavorites", {
            brand: vozilo.marka,
            model: vozilo.model,
          })
        : tVehicles("removedFromFavorites", {
            brand: vozilo.marka,
            model: vozilo.model,
          })
    );
  };

  const handleCompareClick = () => {
    if (isInList(vozilo.id)) {
      removeVozilo(vozilo.id);
      toast.success(
        tVehicles("removedFromCompare", {
          brand: vozilo.marka,
          model: vozilo.model,
        })
      );
      return;
    }

    const added = addVozilo(vozilo);
    if (added) {
      toast.success(
        tVehicles("addedToCompare", {
          brand: vozilo.marka,
          model: vozilo.model,
        })
      );
    } else {
      toast.error(tVehicles("maxCompare"));
    }
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${vozilo.marka} ${vozilo.model}`,
          url,
        });
      } catch {
        // User cancelled
      }
      return;
    }

    await navigator.clipboard.writeText(url);
    toast.success(tVehicles("detail.linkCopied"));
  };

  const savings = vozilo.staracijena
    ? vozilo.staracijena - vozilo.cijena
    : null;

  const whatsappMessage = `${vozilo.marka} ${vozilo.model} (${vozilo.godina})${
    currentUrl ? ` - ${currentUrl}` : ""
  }`;

  const specs: Spec[] = [
    {
      icon: Calendar,
      label: tCompare("specs.year"),
      value: vozilo.godina.toString(),
    },
    {
      icon: Gauge,
      label: tCompare("specs.mileage"),
      value: formatKilometraza(vozilo.kilometraza),
    },
    {
      icon: Fuel,
      label: tCompare("specs.fuel"),
      value: tVehicles(`fuel.${vozilo.gorivo}`),
    },
    {
      icon: Settings,
      label: tCompare("specs.transmission"),
      value: tVehicles(`transmission.${vozilo.mjenjac}`),
    },
    {
      icon: Zap,
      label: tCompare("specs.power"),
      value: `${vozilo.snaga} kW (${Math.round(vozilo.snaga * 1.341)} KS)`,
    },
    {
      icon: Palette,
      label: tCompare("specs.color"),
      value: vozilo.boja,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Back Navigation */}
      <div className="container mx-auto px-4 py-4">
        <Link
          href="/vozila"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{tVehicles("detail.backToVehicles")}</span>
        </Link>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ImageGallery
              images={vozilo.slike}
              alt={`${vozilo.marka} ${vozilo.model}`}
            />

            {/* Badges */}
            <div className="flex gap-2 mt-4">
              {vozilo.ekskluzivno && (
                <Badge className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white border-0">
                  ✨ {tVehicles("card.exclusive")}
                </Badge>
              )}
              {vozilo.istaknuto && (
                <Badge variant="secondary">{tVehicles("card.featured")}</Badge>
              )}
              {savings && (
                <Badge className="bg-[oklch(0.65_0.15_165)] text-white border-0">
                  {tVehicles("card.savings")} {formatCijena(savings)}
                </Badge>
              )}
            </div>
          </motion.div>

          {/* Right Column - Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Title & Price */}
            <div>
              <h1 className={`${typography.h1} mb-2`}>
                {vozilo.marka} {vozilo.model}
              </h1>
              <PriceDisplay
                price={vozilo.cijena}
                oldPrice={vozilo.staracijena}
                variant="detail"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant={isFavorit(vozilo.id) ? "default" : "outline"}
                onClick={handleFavoriteClick}
                className="flex-1 sm:flex-none"
              >
                <Heart
                  className={`mr-2 h-4 w-4 ${
                    isFavorit(vozilo.id) ? "fill-current" : ""
                  }`}
                />
                {tCommon("nav.favorites")}
              </Button>
              <Button
                variant={isInList(vozilo.id) ? "default" : "outline"}
                onClick={handleCompareClick}
                className="flex-1 sm:flex-none"
              >
                <GitCompare className="mr-2 h-4 w-4" />
                {tCommon("nav.compare")}
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                className="flex-1 sm:flex-none"
              >
                <Share2 className="mr-2 h-4 w-4" />
                {tVehicles("detail.shareVehicle")}
              </Button>
            </div>

            <Separator />

            {/* Specifications Grid */}
            <Card className={components.card.default}>
              <CardContent className={spacing.card.medium}>
                <h2 className={`${typography.h4} mb-4`}>
                  {tVehicles("detail.specifications")}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {specs.map((spec) => (
                    <div key={spec.label} className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-accent/10">
                        <spec.icon className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {spec.label}
                        </p>
                        <p className="font-medium">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Financing Calculator */}
            <Card className={components.card.default}>
              <CardContent className={spacing.card.medium}>
                <h2 className={`${typography.h4} mb-4`}>
                  {tVehicles("detail.financing")}
                </h2>
                <KalkulatorFinanciranja cijenaVozila={vozilo.cijena} />
              </CardContent>
            </Card>

            {/* Description */}
            <Card className={components.card.default}>
              <CardContent className={spacing.card.medium}>
                <h2 className={`${typography.h4} mb-3`}>
                  {tVehicles("detail.description")}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {vozilo.opis}
                </p>
              </CardContent>
            </Card>

            {/* Features */}
            {vozilo.karakteristike.length > 0 && (
              <Card className={components.card.default}>
                <CardContent className={spacing.card.medium}>
                  <h2 className={`${typography.h4} mb-4`}>
                    {tVehicles("detail.features")}
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    {vozilo.karakteristike.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact CTA */}
            <Card className="bg-accent/5 border-accent/20">
              <CardContent className={spacing.card.medium}>
                <h2 className={`${typography.h4} mb-4`}>
                  {tVehicles("detail.contactSeller")}
                </h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href={`tel:${CONTACT.phoneRaw}`} className="flex-1">
                    <Button className={`${components.button.primary} w-full`}>
                      <Phone className="mr-2 h-4 w-4" />
                      {tCommon("header.call")}
                    </Button>
                  </a>
                  <a
                    href={CONTACT.whatsapp.messageUrl(whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      className="w-full bg-green-500/10 border-green-500/30 hover:bg-green-500/20"
                    >
                      <MessageCircle className="mr-2 h-4 w-4 text-green-600" />
                      WhatsApp
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recently Viewed */}
        <div className="mt-16">
          <RecentlyViewed />
        </div>
      </div>
    </div>
  );
}

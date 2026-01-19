"use client";

import { useMemo } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Fuel,
  Gauge,
  Settings,
  Zap,
  Palette,
  ArrowRight,
  Trash2,
  Plus,
  GitCompare,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageSkeleton from "@/components/PageSkeleton";
import { FadeIn } from "@/components/PageTransition";
import { useUsporediStore } from "@/stores/usporediStore";
import { typography, spacing, components } from "@/lib/designTokens";
import { formatCijena, formatKilometraza, formatSnaga } from "@/lib/vozila";
import { Vozilo } from "@/types/vozilo";

export default function UsporediClient() {
  const vozila = useUsporediStore((state) => state.vozila);
  const removeVozilo = useUsporediStore((state) => state.removeVozilo);
  const clearAll = useUsporediStore((state) => state.clearAll);
  const hasHydrated = useUsporediStore((state) => state.hasHydrated);
  const t = useTranslations("compare");
  const tVehicles = useTranslations("vehicles");

  const comparisonSpecs = useMemo(
    () => [
      {
        key: "cijena",
        label: t("specs.price"),
        format: (v: Vozilo) => formatCijena(v.cijena),
        icon: null,
        highlight: true,
      },
      {
        key: "godina",
        label: t("specs.year"),
        format: (v: Vozilo) => v.godina.toString(),
        icon: Calendar,
      },
      {
        key: "kilometraza",
        label: t("specs.mileage"),
        format: (v: Vozilo) => formatKilometraza(v.kilometraza),
        icon: Gauge,
      },
      {
        key: "gorivo",
        label: t("specs.fuel"),
        format: (v: Vozilo) => tVehicles(`fuel.${v.gorivo}`),
        icon: Fuel,
      },
      {
        key: "mjenjac",
        label: t("specs.transmission"),
        format: (v: Vozilo) => tVehicles(`transmission.${v.mjenjac}`),
        icon: Settings,
      },
      {
        key: "snaga",
        label: t("specs.power"),
        format: (v: Vozilo) => formatSnaga(v.snaga),
        icon: Zap,
      },
      {
        key: "boja",
        label: t("specs.color"),
        format: (v: Vozilo) => v.boja,
        icon: Palette,
      },
    ],
    [t, tVehicles]
  );

  // Calculate best values for highlighting
  const bestValues = useMemo(() => {
    if (vozila.length === 0) return null;

    return {
      lowestPrice: Math.min(...vozila.map((v) => v.cijena)),
      newestYear: Math.max(...vozila.map((v) => v.godina)),
      lowestKm: Math.min(...vozila.map((v) => v.kilometraza)),
    };
  }, [vozila]);

  if (!hasHydrated) {
    return <PageSkeleton />;
  }

  if (vozila.length === 0) {
    return (
      <div className="min-h-screen">
        {/* Header */}
        <section className={`bg-primary ${spacing.section.small}`}>
          <div className="container mx-auto px-4">
            <FadeIn>
              <h1 className={`${typography.h2} text-white mb-2`}>
                {t("pageTitle")}
              </h1>
              <p className={`${typography.body} text-white/90`}>
                {t("pageDescription")}
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Empty State */}
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`w-24 h-24 rounded-2xl ${components.icon.background} flex items-center justify-center mx-auto mb-6`}
            >
              <GitCompare className={`w-12 h-12 ${components.icon.accent}`} />
            </motion.div>
            <h2 className={`${typography.h3} text-foreground mb-3`}>
              {t("emptyTitle")}
            </h2>
            <p className={`${typography.body} text-muted-foreground mb-8`}>
              {t("emptyDescription")}
            </p>
            <Link href="/vozila">
              <Button
                size="lg"
                className={`gap-2 ${components.button.primary}`}
              >
                <Plus className="w-5 h-5" />
                {t("browseVehicles")}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className={`bg-primary ${spacing.section.small}`}>
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className={`${typography.h2} text-white mb-2`}>
                  {t("pageTitle")}
                </h1>
                <p className={`${typography.body} text-white/90`}>
                  {t("comparingCount", { count: vozila.length })}
                </p>
              </div>
              <div className="flex gap-3">
                {vozila.length < 3 && (
                  <Link href="/vozila">
                    <Button variant="secondary" className="gap-2">
                      <Plus className="w-4 h-4" />
                      {t("addVehicle")}
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  className={`${components.button.secondary} gap-2`}
                  onClick={clearAll}
                >
                  <Trash2 className="w-4 h-4" />
                  {t("clearAll")}
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Mobile: Quick Summary Cards */}
          <div className="md:hidden space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-foreground">
              {t("quickOverview")}
            </h3>
            {vozila.map((vozilo, index) => (
              <motion.div
                key={vozilo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <div className="flex">
                    <div className="relative w-24 h-24 shrink-0">
                      <Image
                        src={vozilo.slike[0]}
                        alt={`${vozilo.marka} ${vozilo.model}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="flex-1 p-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link
                            href={`/vozila/${vozilo.id}`}
                            className="font-semibold text-foreground hover:text-primary transition-colors text-sm"
                          >
                            {vozilo.marka} {vozilo.model}
                          </Link>
                          <p className="text-lg font-bold text-accent mt-1">
                            {formatCijena(vozilo.cijena)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 -mr-2 -mt-1"
                          onClick={() => removeVozilo(vozilo.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                        <span>{vozilo.godina}</span>
                        <span>•</span>
                        <span>{formatKilometraza(vozilo.kilometraza)}</span>
                        <span>•</span>
                        <span>{tVehicles("fuel." + vozilo.gorivo)}</span>
                      </div>
                      {bestValues &&
                        vozilo.cijena === bestValues.lowestPrice && (
                          <Badge className="mt-2 bg-success text-success-foreground text-xs">
                            <Trophy className="w-3 h-3 mr-1" />
                            {t("lowestPrice")}
                          </Badge>
                        )}
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
            {vozila.length < 3 && (
              <Link href="/vozila">
                <Card className="border-dashed border-2 border-muted-foreground/20 hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="flex items-center justify-center gap-2 p-4 text-muted-foreground">
                    <Plus className="w-5 h-5" />
                    <span className="text-sm">
                      {t("addVehicleForComparison")}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            )}
          </div>

          {/* Desktop/Tablet: Full comparison table */}
          <div className="hidden md:block">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent pb-4">
              <div className="min-w-[600px]">
                {/* Vehicle Cards Header */}
                <div
                  className="grid gap-3 md:gap-4"
                  style={{
                    gridTemplateColumns: `minmax(100px, 150px) repeat(${vozila.length}, minmax(140px, 1fr))`,
                  }}
                >
                  {/* Empty corner cell */}
                  <div />

                  {/* Vehicle Cards */}
                  <AnimatePresence>
                    {vozila.map((vozilo, index) => (
                      <motion.div
                        key={vozilo.id}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="relative overflow-hidden border-border/50">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 z-10 h-8 w-8 bg-white/90 hover:bg-white dark:bg-card/90 dark:hover:bg-card shadow-sm"
                            onClick={() => removeVozilo(vozilo.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>

                          <div className="aspect-[4/3] relative">
                            <Image
                              src={vozilo.slike[0]}
                              alt={`${vozilo.marka} ${vozilo.model}`}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <CardContent className="p-4">
                            <Link
                              href={`/vozila/${vozilo.id}`}
                              className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                            >
                              {vozilo.marka} {vozilo.model}
                            </Link>
                            {vozilo.istaknuto && (
                              <Badge className="mt-2 bg-accent/10 text-accent">
                                {t("featured")}
                              </Badge>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Empty slots */}
                  {Array.from({ length: 3 - vozila.length }).map((_, index) => (
                    <motion.div
                      key={`empty-${index}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: (vozila.length + index) * 0.1 }}
                    >
                      <Link href="/vozila">
                        <Card className="h-full border-dashed border-2 border-muted-foreground/20 hover:border-primary/50 transition-colors cursor-pointer">
                          <CardContent className="h-full flex flex-col items-center justify-center p-8 text-center min-h-[250px]">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                              <Plus className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground text-sm">
                              {t("addVehicleForComparison")}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Comparison Rows */}
                <div className="mt-6 space-y-2">
                  {comparisonSpecs.map((spec, specIndex) => (
                    <motion.div
                      key={spec.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: specIndex * 0.05 }}
                      className={`grid gap-3 md:gap-4 items-center py-3 md:py-4 px-3 md:px-4 rounded-lg ${
                        spec.highlight
                          ? "bg-accent/10"
                          : specIndex % 2 === 0
                            ? "bg-muted/50"
                            : ""
                      }`}
                      style={{
                        gridTemplateColumns: `minmax(100px, 150px) repeat(${vozila.length}, minmax(140px, 1fr))`,
                      }}
                    >
                      {/* Label */}
                      <div className="flex items-center gap-3">
                        {spec.icon && (
                          <spec.icon className="w-5 h-5 text-accent" />
                        )}
                        <span
                          className={`font-medium ${
                            spec.highlight ? "text-accent" : "text-foreground"
                          }`}
                        >
                          {spec.label}
                        </span>
                      </div>

                      {/* Values */}
                      {vozila.map((vozilo) => {
                        const value = vozilo[spec.key as keyof Vozilo];
                        const isLowestPrice =
                          spec.key === "cijena" &&
                          bestValues &&
                          value === bestValues.lowestPrice;
                        const isNewestYear =
                          spec.key === "godina" &&
                          bestValues &&
                          value === bestValues.newestYear;
                        const isLowestKm =
                          spec.key === "kilometraza" &&
                          bestValues &&
                          value === bestValues.lowestKm;

                        const isBestValue =
                          isLowestPrice || isNewestYear || isLowestKm;
                        const highlightClass =
                          isLowestPrice || isLowestKm
                            ? "bg-success/10 border-l-4 border-success"
                            : isNewestYear
                              ? "bg-accent/10 border-l-4 border-accent"
                              : "";

                        return (
                          <div
                            key={vozilo.id}
                            className={`text-center py-2 px-3 rounded-r transition-all ${
                              spec.highlight
                                ? "text-2xl font-bold text-accent"
                                : "text-foreground"
                            } ${highlightClass}`}
                          >
                            {isBestValue && (
                              <Badge
                                className={`mb-2 ${
                                  isLowestPrice || isLowestKm
                                    ? "bg-success text-success-foreground shadow-lg shadow-success/50"
                                    : "bg-accent text-accent-foreground shadow-lg shadow-accent/50"
                                }`}
                              >
                                <Trophy className="w-3 h-3 mr-1" />
                                {isLowestPrice
                                  ? t("lowestPrice")
                                  : isNewestYear
                                    ? t("newest")
                                    : t("lowestMileage")}
                              </Badge>
                            )}
                            <div>{spec.format(vozilo)}</div>
                          </div>
                        );
                      })}

                      {/* Empty cells for missing vehicles */}
                      {Array.from({ length: 3 - vozila.length }).map(
                        (_, index) => (
                          <div
                            key={`empty-${index}`}
                            className="text-center text-muted-foreground"
                          >
                            -
                          </div>
                        )
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Features Comparison */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-4 px-4">
                    {t("features")}
                  </h3>

                  {/* Get all unique features */}
                  {(() => {
                    const allFeatures = new Set<string>();
                    vozila.forEach((v) =>
                      v.karakteristike.forEach((k) => allFeatures.add(k))
                    );

                    return Array.from(allFeatures).map((feature, index) => (
                      <div
                        key={feature}
                        className={`grid gap-3 md:gap-4 items-center py-2 md:py-3 px-3 md:px-4 rounded-lg ${
                          index % 2 === 0 ? "bg-muted/30" : ""
                        }`}
                        style={{
                          gridTemplateColumns: `minmax(100px, 150px) repeat(${vozila.length}, minmax(140px, 1fr))`,
                        }}
                      >
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                        {vozila.map((vozilo) => (
                          <div key={vozilo.id} className="text-center">
                            {vozilo.karakteristike.includes(feature) ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-success/10 text-success">
                                ✓
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground">
                                -
                              </span>
                            )}
                          </div>
                        ))}
                        {Array.from({ length: 3 - vozila.length }).map(
                          (_, idx) => (
                            <div
                              key={`empty-${idx}`}
                              className="text-center text-muted-foreground"
                            >
                              -
                            </div>
                          )
                        )}
                      </div>
                    ));
                  })()}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-primary">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {t("ctaTitle")}
              </h2>
              <p className="text-white/70 mb-6">{t("ctaDescription")}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/kontakt">
                  <Button
                    size="lg"
                    className="bg-accent text-white hover:bg-accent/90 gap-2"
                  >
                    {t("contactUs")}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <a href="tel:+385991663776">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    +385 99 166 3776
                  </Button>
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

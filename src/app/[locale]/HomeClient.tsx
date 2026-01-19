"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Handshake,
  Headphones,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import HeroCarousel from "@/components/HeroCarousel";
import HeroSearch from "@/components/HeroSearch";
import EkskluzivnaPonuda from "@/components/EkskluzivnaPonuda";
import HomeMap from "@/components/HomeMap";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/PageTransition";
import { typography, spacing, components } from "@/lib/designTokens";
import { Link } from "@/i18n/navigation";

export default function HomeClient() {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");

  const features = [
    {
      icon: Shield,
      title: t("features.quality.title"),
      description: t("features.quality.description"),
    },
    {
      icon: Handshake,
      title: t("features.transparency.title"),
      description: t("features.transparency.description"),
    },
    {
      icon: Headphones,
      title: t("features.support.title"),
      description: t("features.support.description"),
    },
  ];

  return (
    <>
      {/* Hero Carousel with Search Overlay */}
      <HeroCarousel>
        <HeroSearch />
      </HeroCarousel>

      {/* Ekskluzivna Ponuda Section */}
      <EkskluzivnaPonuda />

      {/* Why Us Section */}
      <section className={`${spacing.section.medium} bg-muted/50`}>
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className={`${typography.h2} text-foreground mb-4`}>
                {t("features.title")}
              </h2>
              <p
                className={`${typography.body} text-muted-foreground max-w-2xl mx-auto`}
              >
                {t("features.subtitle")}
              </p>
            </div>
          </FadeIn>

          <StaggerContainer
            className={`grid grid-cols-1 md:grid-cols-3 ${spacing.gap.default}`}
          >
            {features.map((feature) => (
              <StaggerItem key={feature.title}>
                <Card className={`${components.card.elevated} h-full`}>
                  <CardContent className={`${spacing.card.medium} text-center`}>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-16 h-16 rounded-2xl ${components.icon.background} flex items-center justify-center mx-auto mb-4`}
                    >
                      <feature.icon
                        className={`w-8 h-8 ${components.icon.accent}`}
                      />
                    </motion.div>
                    <h3 className={`${typography.h4} text-foreground mb-2`}>
                      {feature.title}
                    </h3>
                    <p className={`${typography.body} text-muted-foreground`}>
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className={`${spacing.section.medium} bg-gradient-to-br from-primary via-primary/90 to-accent/20`}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <FadeIn>
              <h2 className={`${typography.h2} text-white mb-4`}>
                {t("cta.title")}
              </h2>
              <p className={`${typography.bodyLarge} text-white/90 mb-8`}>
                {t("cta.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/kontakt">
                  <Button
                    size="lg"
                    className={`${components.button.primary} min-w-[200px]`}
                  >
                    {t("cta.contactUs")}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <a href="tel:+385991663776">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 font-semibold min-w-[200px]"
                  >
                    +385 99 166 3776
                  </Button>
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <HomeMap />
    </>
  );
}

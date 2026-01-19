"use client";

import { motion } from "framer-motion";
import { Shield, Handshake, Headphones } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/PageTransition";
import { typography, spacing, components } from "@/lib/designTokens";

export default function HomeFeatures() {
  const t = useTranslations("home");

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
  );
}

"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Shield,
  Heart,
  CheckCircle,
  ArrowRight,
  Car,
  Handshake,
  TrendingUp,
  FileCheck,
  Store,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  SlideIn,
} from "@/components/PageTransition";
import { typography, components } from "@/lib/designTokens";

export default function ONamaClient() {
  const t = useTranslations("about");

  const values = [
    {
      icon: FileCheck,
      title: t("values.verified.title"),
      description: t("values.verified.description"),
    },
    {
      icon: Shield,
      title: t("values.warranty.title"),
      description: t("values.warranty.description"),
    },
    {
      icon: TrendingUp,
      title: t("values.financing.title"),
      description: t("values.financing.description"),
    },
    {
      icon: Heart,
      title: t("values.support.title"),
      description: t("values.support.description"),
    },
  ];

  const maloprodajaFeatures = [
    {
      icon: FileCheck,
      title: t("retail.features.history.title"),
      description: t("retail.features.history.description"),
    },
    {
      icon: Shield,
      title: t("retail.features.noSurprises.title"),
      description: t("retail.features.noSurprises.description"),
    },
    {
      icon: CheckCircle,
      title: t("retail.features.safePurchase.title"),
      description: t("retail.features.safePurchase.description"),
    },
  ];

  const veleprodajaFeatures = [
    {
      icon: TrendingUp,
      title: t("wholesale.features.prices.title"),
      description: t("wholesale.features.prices.description"),
    },
    {
      icon: Handshake,
      title: t("wholesale.features.cooperation.title"),
      description: t("wholesale.features.cooperation.description"),
    },
    {
      icon: Truck,
      title: t("wholesale.features.support.title"),
      description: t("wholesale.features.support.description"),
    },
  ];

  const stats = [
    {
      icon: FileCheck,
      value: "100%",
      label: t("stats.verified.label"),
      sublabel: t("stats.verified.sublabel"),
    },
    {
      icon: Shield,
      value: t("stats.warranty.value"),
      label: t("stats.warranty.label"),
      sublabel: t("stats.warranty.sublabel"),
    },
    {
      icon: TrendingUp,
      value: t("stats.financing.value"),
      label: t("stats.financing.label"),
      sublabel: t("stats.financing.sublabel"),
    },
    {
      icon: Heart,
      value: t("stats.support.value"),
      label: t("stats.support.label"),
      sublabel: t("stats.support.sublabel"),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Redesigned with diagonal split */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920"
            alt="Produkt Auto - O nama"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-transparent dark:from-gray-900/95 dark:via-gray-900/80 dark:to-gray-900/60" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-1.5 bg-accent/20 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-6"
              >
                {t("hero.yourPartner")}
              </motion.span>
              <h1 className={`${typography.h1} text-white mb-6`}>
                Produkt Auto
              </h1>
              <p
                className={`${typography.bodyLarge} text-white/90 leading-relaxed`}
              >
                {t("companyDescription")}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Stats Section - Floating cards effect */}
      <section className="py-8 bg-background relative -mt-12 z-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl shadow-xl border border-border/50 p-6 md:p-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-14 h-14 rounded-2xl ${components.icon.background} flex items-center justify-center mx-auto mb-3 group-hover:shadow-lg transition-shadow`}
                  >
                    <stat.icon
                      className={`w-7 h-7 ${components.icon.accent}`}
                    />
                  </motion.div>
                  <div
                    className={`text-xl md:text-2xl font-bold ${components.icon.accent} mb-1`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-foreground font-medium text-sm">
                    {stat.label}
                  </div>
                  <div className="text-muted-foreground text-xs mt-0.5">
                    {stat.sublabel}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Two Columns: Maloprodaja & Veleprodaja */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Maloprodaja Card */}
            <SlideIn direction="left">
              <motion.div whileHover={{ y: -5 }} className="h-full">
                <Card className="h-full bg-gradient-to-br from-accent/5 via-background to-background border-accent/20 hover:border-accent/40 transition-all duration-300 overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
                        <Store className="w-7 h-7 text-accent" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">
                          {t("retail.title")}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                          {t("retail.subtitle")}
                        </p>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {t("retail.description")}
                      <span className="text-foreground font-medium">
                        {" "}
                        {t("retail.highlight")}
                      </span>
                    </p>

                    <div className="space-y-4 mb-6">
                      {maloprodajaFeatures.map((feature, index) => (
                        <motion.div
                          key={feature.title}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                            <feature.icon className="w-5 h-5 text-accent" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">
                              {feature.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {feature.description}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <Link href="/vozila">
                      <Button className="w-full bg-accent hover:bg-accent/90 text-white">
                        {t("retail.browseVehicles")}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </SlideIn>

            {/* Veleprodaja Card */}
            <SlideIn direction="right">
              <motion.div whileHover={{ y: -5 }} className="h-full">
                <Card className="h-full bg-gradient-to-br from-primary/5 via-background to-background border-primary/20 hover:border-primary/40 transition-all duration-300 overflow-hidden dark:from-primary/10">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Handshake className="w-7 h-7 text-primary dark:text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">
                          {t("wholesale.title")}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                          {t("wholesaleCard.subtitle")}
                        </p>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {t("wholesaleCard.description")}{" "}
                      <span className="text-foreground font-medium">
                        {t("wholesaleCard.descriptionHighlight")}
                      </span>
                    </p>

                    <div className="space-y-4 mb-6">
                      {veleprodajaFeatures.map((feature, index) => (
                        <motion.div
                          key={feature.title}
                          initial={{ opacity: 0, x: 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <feature.icon className="w-5 h-5 text-primary dark:text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground">
                              {feature.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {feature.description}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <Link href="/kontakt">
                      <Button
                        variant="outline"
                        className="w-full border-primary/50 text-primary hover:bg-primary hover:text-white dark:border-white/50 dark:text-white dark:hover:bg-white dark:hover:text-primary"
                      >
                        {t("wholesaleCard.contactUs")}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* Philosophy Banner */}
      <section className="py-16 bg-gradient-to-r from-primary via-primary/95 to-accent/80">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6"
            >
              <Heart className="w-5 h-5 text-white" />
              <span className="text-white/90 font-medium">
                {t("philosophy.title")}
              </span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t("philosophy.description")}
            </h2>
            <p className="text-white/80 text-lg">{t("philosophy.subtitle")}</p>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t("values.title")}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t("valuesSubtitle")}
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <Card className="h-full bg-card border-border/50 hover:shadow-lg hover:border-accent/30 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-14 h-14 rounded-2xl bg-accent/10 dark:bg-accent/20 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors"
                    >
                      <value.icon className="w-7 h-7 text-accent" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t("cta.title")}
              </h2>
              <p className="text-muted-foreground mb-8">
                {t("cta.description")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/vozila">
                  <Button
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-white min-w-[200px]"
                  >
                    <Car className="w-5 h-5 mr-2" />
                    {t("cta.viewVehicles")}
                  </Button>
                </Link>
                <Link href="/kontakt">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary/50 text-primary hover:bg-primary hover:text-white dark:border-white/50 dark:text-white dark:hover:bg-white dark:hover:text-primary min-w-[200px]"
                  >
                    <Handshake className="w-5 h-5 mr-2" />
                    {t("cta.becomePartner")}
                  </Button>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

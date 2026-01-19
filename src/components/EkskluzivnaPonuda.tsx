"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ExclusiveVehicleCard from "@/components/ExclusiveVehicleCard";
import { useEffect, useState } from "react";
import type { Vozilo } from "@/types/vozilo";
import { typography, spacing } from "@/lib/designTokens";

export default function EkskluzivnaPonuda() {
  const t = useTranslations("exclusive");
  const [ekskluzivnaVozila, setEkskluzivnaVozila] = useState<Vozilo[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const res = await fetch("/api/vehicles?exclusive=1&limit=4", {
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = await res.json();
      if (active) setEkskluzivnaVozila((data.vozila ?? []) as Vozilo[]);
    })();
    return () => {
      active = false;
    };
  }, []);

  if (ekskluzivnaVozila.length === 0) {
    return null;
  }

  return (
    <section
      className={`${spacing.section.medium} bg-gradient-to-b from-accent/5 to-background pt-8 md:pt-10 -mt-4`}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className={`${typography.h2} text-foreground mb-4`}>
            {t("title")}
          </h2>
          <p
            className={`${typography.body} text-muted-foreground max-w-2xl mx-auto`}
          >
            {t("description")}
          </p>
        </motion.div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {ekskluzivnaVozila.map((vozilo, index) => (
            <motion.div
              key={vozilo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="h-full"
            >
              <ExclusiveVehicleCard vozilo={vozilo} />
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <Link href="/vozila?ekskluzivno=true">
            <Button
              size="lg"
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-white transition-all"
            >
              {t("viewAllOffers")}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

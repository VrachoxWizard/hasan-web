"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import VoziloCard from "@/components/VoziloCard";
import { useFavoritiStore } from "@/stores/favoritiStore";
import { Vozilo } from "@/types/vozilo";

export default function RecentlyViewed() {
  const t = useTranslations("recentlyViewed");
  const recentlyViewed = useFavoritiStore((state) => state.recentlyViewed);

  const [recentVozila, setRecentVozila] = useState<Vozilo[]>([]);

  const idsParam = useMemo(
    () => recentlyViewed.slice(0, 10).join(","),
    [recentlyViewed]
  );

  useEffect(() => {
    let active = true;
    if (!idsParam) {
      setRecentVozila([]);
      return;
    }
    (async () => {
      const res = await fetch(
        `/api/vehicles?ids=${encodeURIComponent(idsParam)}`,
        { cache: "no-store" }
      );
      if (!res.ok) return;
      const data = await res.json();
      const vozila = (data.vozila ?? []) as Vozilo[];
      if (active) setRecentVozila(vozila.slice(0, 4));
    })();
    return () => {
      active = false;
    };
  }, [idsParam]);

  if (recentVozila.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>
          </div>
          <Link href="/vozila">
            <Button
              variant="ghost"
              className="text-accent hover:text-accent/80"
            >
              {t("allVehicles")}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentVozila.map((vozilo, index) => (
            <VoziloCard key={vozilo.id} vozilo={vozilo} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

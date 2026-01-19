"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Vozilo } from "@/types/vozilo";
import { cn } from "@/lib/utils";
import { formatCijena } from "@/lib/vozila";

interface ExclusiveVehicleCardProps {
  vozilo: Vozilo;
  priority?: boolean;
}

export default function ExclusiveVehicleCard({
  vozilo,
  priority = false,
}: ExclusiveVehicleCardProps) {
  const t = useTranslations("vehicles");

  // Calculate discount percentage if old price exists
  const discountPercentage = vozilo.staracijena
    ? Math.round(
        ((vozilo.staracijena - vozilo.cijena) / vozilo.staracijena) * 100,
      )
    : 0;

  const discountAmount = vozilo.staracijena
    ? vozilo.staracijena - vozilo.cijena
    : 0;

  return (
    <Link href={`/vozila/${vozilo.id}`} className="block group h-full">
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="relative h-full flex flex-col"
      >
        {/* Card Frame - Dark Mode (Default) & Light Mode Adaptive */}
        <div className="relative h-full bg-[#0a0a0a] dark:bg-[#050505] border-[3px] border-[#bf953f] rounded-lg overflow-hidden shadow-2xl flex flex-col">
          {/* Inner Gold Border */}
          <div className="absolute inset-[3px] border border-[#fcf6ba]/30 rounded-lg pointer-events-none z-20" />

          {/* Top Exclusive Banner */}
          <div className="relative h-10 bg-linear-to-r from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] border-b border-[#bf953f] flex items-center justify-center z-10">
            <div className="flex items-center gap-3 w-full justify-center px-4">
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-[#bf953f] to-transparent opacity-50" />
              <span className="text-[#bf953f] font-serif tracking-[0.2em] text-xs font-bold uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {t("card.exclusive")}
              </span>
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-[#bf953f] to-transparent opacity-50" />
            </div>
          </div>

          {/* Image Container */}
          <div className="relative aspect-4/3 w-full overflow-hidden bg-black">
            <Image
              src={vozilo.slike[0] || "/placeholder-car.jpg"}
              alt={`${vozilo.marka} ${vozilo.model}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              priority={priority}
            />
            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/40" />
          </div>

          {/* Content Section */}
          <div className="relative flex-1 flex flex-col items-center text-center p-4 pt-6 bg-linear-to-b from-[#0a0a0a] to-[#111] text-[#e5e5e5]">
            {/* Decorative Divider Top */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-linear-to-r from-transparent via-[#bf953f]/50 to-transparent" />

            {/* Title: Year | Make Model */}
            <h3 className="font-serif text-xl md:text-2xl text-[#fcf6ba] mb-2 drop-shadow-md">
              <span className="text-[#bf953f]">{vozilo.godina}</span>{" "}
              <span className="text-[#bf953f]/60 mx-1">|</span> {vozilo.marka}{" "}
              {vozilo.model}
            </h3>

            {/* Specs Line */}
            <div className="flex items-center justify-center gap-3 text-xs md:text-sm text-[#bf953f]/80 font-medium tracking-wider uppercase mb-4">
              <span>{vozilo.gorivo}</span>
              <span className="w-1 h-1 rounded-full bg-[#bf953f]/50" />
              <span>{vozilo.snaga} KS</span>
              <span className="w-1 h-1 rounded-full bg-[#bf953f]/50" />
              <span>{vozilo.mjenjac}</span>
            </div>

            {/* Price Section */}
            <div className="mt-auto w-full space-y-2">
              {/* Old Price & Discount */}
              {vozilo.staracijena && (
                <div className="flex items-center justify-center gap-3 text-xs md:text-sm">
                  <span className="text-white/40 line-through decoration-[#bf953f]/50">
                    {formatCijena(vozilo.staracijena)}
                  </span>
                  <span className="px-2 py-0.5 bg-[#bf953f]/10 border border-[#bf953f]/30 rounded text-[#bf953f] font-bold">
                    {t("card.savings")}: -{formatCijena(discountAmount)}
                  </span>
                </div>
              )}

              {/* Current Price */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#bf953f]/20"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-[#0a0a0a] px-4 text-xl md:text-2xl font-bold text-[#fcf6ba] drop-shadow-[0_0_10px_rgba(191,149,63,0.3)]">
                    {formatCijena(vozilo.cijena)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Exclusive Banner */}
          <div className="relative h-8 bg-linear-to-r from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] border-t border-[#bf953f] flex items-center justify-center z-10">
            <div className="flex items-center gap-2 w-full justify-center px-4">
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-[#bf953f] to-transparent opacity-50" />
              <div className="w-1.5 h-1.5 rotate-45 bg-[#bf953f]" />
              <span className="text-[#bf953f] font-serif tracking-[0.2em] text-[10px] font-bold uppercase">
                {t("card.exclusive")}
              </span>
              <div className="w-1.5 h-1.5 rotate-45 bg-[#bf953f]" />
              <div className="h-px flex-1 bg-linear-to-r from-transparent via-[#bf953f] to-transparent opacity-50" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

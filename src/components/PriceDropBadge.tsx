"use client";

import { motion } from "framer-motion";
import { TrendingDown } from "lucide-react";
import { useTranslations } from "next-intl";

interface PriceDropBadgeProps {
  originalPrice: number;
  currentPrice: number;
  className?: string;
}

export default function PriceDropBadge({
  originalPrice,
  currentPrice,
  className = "",
}: PriceDropBadgeProps) {
  const t = useTranslations("vehicles");
  const savingsAmount = originalPrice - currentPrice;
  const discountPercent = Math.round((savingsAmount / originalPrice) * 100);

  // Only show badge if discount is 5% or more
  if (discountPercent < 5) {
    return null;
  }

  // Format savings with thousands separator
  const formattedSavings = new Intl.NumberFormat("hr-HR").format(savingsAmount);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`absolute bottom-16 right-3 z-10 flex items-center gap-1.5 bg-emerald-600/90 dark:bg-emerald-600/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg border border-emerald-500/30 ${className}`}
    >
      <TrendingDown className="w-3.5 h-3.5 text-white" />
      <span className="text-emerald-100 uppercase tracking-wide">
        {t("card.savings")}
      </span>
      <span className="text-white font-bold">{formattedSavings} €</span>
    </motion.div>
  );
}

"use client";

import { formatCijena } from "@/lib/vozila";
import { useTranslations } from "next-intl";
import { savings } from "@/lib/designTokens";
import { cn } from "@/lib/utils";

export type PriceVariant = "card" | "list" | "detail";

interface PriceDisplayProps {
  price: number;
  oldPrice?: number;
  variant?: PriceVariant;
  className?: string;
  showSavings?: boolean;
}

/**
 * PriceDisplay Component
 * Unified price display with consistent styling across the app
 * Uses premium savings color system (teal-green + bronze)
 *
 * Variants:
 * - card: For vehicle cards with overlay (white text, drop shadow)
 * - list: For list items (savings colored)
 * - detail: For detail pages (larger, savings colored)
 */
export default function PriceDisplay({
  price,
  oldPrice,
  variant = "card",
  className,
  showSavings = true,
}: PriceDisplayProps) {
  const t = useTranslations("vehicles");
  const hasDiscount = oldPrice && oldPrice > price;
  const savingsAmount = hasDiscount ? oldPrice - price : 0;

  // Format savings with thousands separator
  const formatSavings = (amount: number) => {
    return new Intl.NumberFormat("hr-HR").format(amount);
  };

  // Size variants for typography
  const sizeStyles = {
    card: {
      oldPrice: "text-lg",
      currentPrice: "text-3xl",
      savingsText: "text-xs",
    },
    list: {
      oldPrice: "text-lg",
      currentPrice: "text-2xl",
      savingsText: "text-xs",
    },
    detail: {
      oldPrice: "text-xl",
      currentPrice: "text-3xl",
      savingsText: "text-sm",
    },
  };

  const sizes = sizeStyles[variant];

  if (hasDiscount) {
    return (
      <div className={cn("flex flex-col", className)}>
        <span className={cn(sizes.oldPrice, savings.oldPrice[variant])}>
          {formatCijena(oldPrice)}
        </span>
        <span className={cn(sizes.currentPrice, savings.price[variant])}>
          {formatCijena(price)}
        </span>
        {showSavings && savingsAmount > 0 && (
          <span className={sizes.savingsText}>
            <span className={savings.label}>{t("card.savings")}: </span>
            <span className={savings.amount}>
              {formatSavings(savingsAmount)} €
            </span>
          </span>
        )}
      </div>
    );
  }

  // Non-discounted price - use accent color for regular prices
  const regularPriceStyles = {
    card: "text-3xl font-bold text-white drop-shadow-lg",
    list: "text-2xl font-bold text-accent",
    detail: "text-3xl font-bold text-accent",
  };

  return (
    <span className={cn(regularPriceStyles[variant], className)}>
      {formatCijena(price)}
    </span>
  );
}

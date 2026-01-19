"use client";

import { useState, useMemo } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MARKE,
  MODELI_PO_MARKI,
  GODINE,
  GORIVA,
  MJENJACI,
} from "@/types/vozilo";

const MAX_PRICE = 100000;

type HeroSearchProps = {
  totalVehicles?: number;
};

export default function HeroSearch({ totalVehicles }: HeroSearchProps = {}) {
  const router = useRouter();
  const t = useTranslations("search");
  const [marka, setMarka] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [godina, setGodina] = useState<string>("");
  const [gorivo, setGorivo] = useState<string>("");
  const [mjenjac, setMjenjac] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number[]>([0, MAX_PRICE]);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  // Get available models based on selected brand
  const availableModels = useMemo(() => {
    if (!marka) return [];
    return MODELI_PO_MARKI[marka] || [];
  }, [marka]);

  // Reset model when brand changes
  const handleMarkaChange = (value: string) => {
    setMarka(value);
    setModel("");
  };

  // Count active additional filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (godina) count++;
    if (gorivo) count++;
    if (mjenjac) count++;
    return count;
  }, [godina, gorivo, mjenjac]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (marka) params.set("marka", marka);
    if (model) params.set("model", model);
    if (godina) params.set("godinaOd", godina);
    if (gorivo) params.set("gorivo", gorivo);
    if (mjenjac) params.set("mjenjac", mjenjac);
    if (priceRange[0] > 0) params.set("cijenaOd", priceRange[0].toString());
    if (priceRange[1] < MAX_PRICE)
      params.set("cijenaDo", priceRange[1].toString());

    router.push(`/vozila${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("hr-HR").format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="rounded-lg bg-white dark:bg-card shadow-xl border border-border/50"
    >
      <div className="p-3 sm:p-4">
        {/* Primary filters - always visible */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {/* Proizvođač */}
          <Select value={marka} onValueChange={handleMarkaChange}>
            <SelectTrigger className="h-11 bg-background border-border text-sm">
              <SelectValue placeholder={t("manufacturer")} />
            </SelectTrigger>
            <SelectContent>
              {MARKE.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Model */}
          <Select value={model} onValueChange={setModel} disabled={!marka}>
            <SelectTrigger className="h-11 bg-background border-border text-sm">
              <SelectValue placeholder={t("model")} />
            </SelectTrigger>
            <SelectContent>
              {availableModels.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Slider - always visible */}
        <div className="flex items-center gap-3 mt-3 px-1">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground whitespace-nowrap min-w-fit">
            {formatPrice(priceRange[0])}€ - {formatPrice(priceRange[1])}€
          </span>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={MAX_PRICE}
            step={1000}
            className="flex-1"
          />
        </div>

        {/* Mobile: Collapsible additional filters */}
        <div className="mt-3 lg:hidden">
          <button
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className="flex items-center justify-center gap-2 w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            aria-expanded={showMoreFilters}
            aria-controls="additional-filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{t("moreFilters")}</span>
            {activeFiltersCount > 0 && (
              <span className="bg-accent text-white text-xs px-1.5 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
            {showMoreFilters ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          <AnimatePresence>
            {showMoreFilters && (
              <motion.div
                id="additional-filters"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-3 gap-2 pt-3">
                  {/* Godina od */}
                  <Select value={godina} onValueChange={setGodina}>
                    <SelectTrigger className="h-11 bg-background border-border text-xs sm:text-sm">
                      <SelectValue placeholder={t("year")} />
                    </SelectTrigger>
                    <SelectContent>
                      {GODINE.map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Tip goriva */}
                  <Select value={gorivo} onValueChange={setGorivo}>
                    <SelectTrigger className="h-11 bg-background border-border text-xs sm:text-sm">
                      <SelectValue placeholder={t("fuel")} />
                    </SelectTrigger>
                    <SelectContent>
                      {GORIVA.map((g) => (
                        <SelectItem key={g.value} value={g.value}>
                          {g.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Mjenjač */}
                  <Select value={mjenjac} onValueChange={setMjenjac}>
                    <SelectTrigger className="h-11 bg-background border-border text-xs sm:text-sm">
                      <SelectValue placeholder={t("transmission")} />
                    </SelectTrigger>
                    <SelectContent>
                      {MJENJACI.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop: All filters in one row */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-2 mt-3">
          {/* Godina od */}
          <Select value={godina} onValueChange={setGodina}>
            <SelectTrigger className="h-11 bg-background border-border text-sm">
              <SelectValue placeholder={t("yearFrom")} />
            </SelectTrigger>
            <SelectContent>
              {GODINE.map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Tip goriva */}
          <Select value={gorivo} onValueChange={setGorivo}>
            <SelectTrigger className="h-11 bg-background border-border text-sm">
              <SelectValue placeholder={t("fuelType")} />
            </SelectTrigger>
            <SelectContent>
              {GORIVA.map((g) => (
                <SelectItem key={g.value} value={g.value}>
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Mjenjač */}
          <Select value={mjenjac} onValueChange={setMjenjac}>
            <SelectTrigger className="h-11 bg-background border-border text-sm">
              <SelectValue placeholder={t("transmissionType")} />
            </SelectTrigger>
            <SelectContent>
              {MJENJACI.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            className="h-11 text-sm font-semibold bg-accent hover:bg-accent/90 text-white"
          >
            <Search className="w-4 h-4 mr-2" />
            {t("search")}
            {typeof totalVehicles === "number" ? ` (${totalVehicles})` : ""}
          </Button>
        </div>

        {/* Mobile Search Button - Full width */}
        <Button
          onClick={handleSearch}
          className="w-full h-12 mt-3 text-sm font-semibold bg-accent hover:bg-accent/90 text-white lg:hidden"
        >
          <Search className="w-4 h-4 mr-2" />
          {t("searchVehicles")}
          {typeof totalVehicles === "number" ? ` (${totalVehicles})` : ""}
        </Button>
      </div>
    </motion.div>
  );
}

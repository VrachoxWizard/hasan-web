"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { SlidersHorizontal, X, LayoutGrid, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import VoziloCard from "@/components/VoziloCard";
import VoziloListItem from "@/components/VoziloListItem";
import VehicleCardSkeleton from "@/components/VehicleCardSkeleton";
import { typography, spacing } from "@/lib/designTokens";
import { FadeIn } from "@/components/PageTransition";
import {
  filterVozila,
  getSortedVozila,
  formatCijena,
  formatKilometraza,
} from "@/lib/vozila";
import { MARKE, GORIVA, MJENJACI } from "@/types/vozilo";
import type { FilterOptions, Vozilo } from "@/types/vozilo";

type RangeTuple = [number, number];

interface FilterContentProps {
  filters: FilterOptions;
  activeFiltersCount: number;
  onMarkaChange: (value: string) => void;
  onGorivoChange: (gorivo: string, checked: boolean) => void;
  onMjenjacChange: (value: string) => void;
  onPriceCommit: (values: number[]) => void;
  onKmCommit: (value: number) => void;
  onYearCommit: (values: number[]) => void;
  onClearFilters: () => void;
  t: (key: string) => string;
}

function FilterContent({
  filters,
  activeFiltersCount,
  onMarkaChange,
  onGorivoChange,
  onMjenjacChange,
  onPriceCommit,
  onKmCommit,
  onYearCommit,
  onClearFilters,
  t,
}: FilterContentProps) {
  const [priceRange, setPriceRange] = useState<RangeTuple>([
    filters.cijenaOd ?? 0,
    filters.cijenaDo ?? 100000,
  ]);
  const [kmValue, setKmValue] = useState<number>(
    filters.kilometrazaDo ?? 200000
  );
  const [yearRange, setYearRange] = useState<RangeTuple>([
    filters.godinaOd ?? 2017,
    filters.godinaDo ?? 2025,
  ]);

  const filterPresets = [
    {
      labelKey: "quickFilters.luxury",
      icon: "LUX",
      filters: { cijenaOd: 40000, cijenaDo: 100000 },
    },
    {
      labelKey: "quickFilters.economy",
      icon: "ECO",
      filters: { cijenaOd: 0, cijenaDo: 20000 },
    },
    {
      labelKey: "quickFilters.commercial",
      icon: "PRO",
      filters: { cijenaOd: 15000, cijenaDo: 35000 },
    },
  ];

  const applyPreset = (presetFilters: Partial<FilterOptions>) => {
    onPriceCommit([
      presetFilters.cijenaOd ?? 0,
      presetFilters.cijenaDo ?? 100000,
    ]);
    if (presetFilters.godinaOd || presetFilters.godinaDo) {
      onYearCommit([
        presetFilters.godinaOd ?? 2017,
        presetFilters.godinaDo ?? 2025,
      ]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Filter Presets */}
      <div>
        <label
          className={`${typography.small} font-medium text-foreground mb-3 block`}
        >
          {t("quickFiltersLabel")}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {filterPresets.map((preset) => (
            <Button
              key={preset.labelKey}
              variant="outline"
              size="sm"
              onClick={() => applyPreset(preset.filters)}
              className="flex flex-col items-center gap-1 h-auto py-2 px-1 text-xs hover:bg-accent hover:text-accent-foreground"
            >
              <span className="text-lg">{preset.icon}</span>
              <span className="font-medium">{t(preset.labelKey)}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Marka */}
      <div>
        <label
          className={`${typography.small} font-medium text-foreground mb-2 block`}
        >
          {t("brand")}
        </label>
        <Select value={filters.marka || "all"} onValueChange={onMarkaChange}>
          <SelectTrigger>
            <SelectValue placeholder={t("allBrands")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allBrands")}</SelectItem>
            {MARKE.map((marka) => (
              <SelectItem key={marka} value={marka}>
                {marka}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Gorivo */}
      <div>
        <label
          className={`${typography.small} font-medium text-foreground mb-3 block`}
        >
          {t("fuelType")}
        </label>
        <div className="space-y-3">
          {GORIVA.map((g) => (
            <div key={g.value} className="flex items-center gap-2 min-h-[44px]">
              <Checkbox
                id={g.value}
                checked={filters.gorivo?.includes(g.value) || false}
                onCheckedChange={(checked) =>
                  onGorivoChange(g.value, checked as boolean)
                }
                className="h-5 w-5"
              />
              <label
                htmlFor={g.value}
                className={`${typography.small} text-muted-foreground cursor-pointer flex-1 py-2`}
              >
                {g.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Mjenjač */}
      <div>
        <label
          className={`${typography.small} font-medium text-foreground mb-2 block`}
        >
          {t("transmissionType")}
        </label>
        <Select
          value={filters.mjenjac || "all"}
          onValueChange={onMjenjacChange}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("allTransmissions")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allTransmissions")}</SelectItem>
            {MJENJACI.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Cijena */}
      <div>
        <label
          className={`${typography.small} font-medium text-foreground mb-3 block`}
        >
          {t("price")}
        </label>
        <Slider
          value={priceRange}
          onValueChange={(values) => setPriceRange([values[0], values[1]])}
          onValueCommit={(values) => {
            const next: RangeTuple = [values[0], values[1]];
            setPriceRange(next);
            onPriceCommit(next);
          }}
          min={0}
          max={100000}
          step={5000}
          className="mb-2"
        />
        <div
          className={`flex justify-between ${typography.tiny} text-muted-foreground`}
        >
          <span>{formatCijena(priceRange[0])}</span>
          <span>{formatCijena(priceRange[1])}</span>
        </div>
      </div>

      {/* Kilometraža */}
      <div>
        <label
          className={`${typography.small} font-medium text-foreground mb-3 block`}
        >
          {t("maxMileage")}
        </label>
        <Slider
          value={[kmValue]}
          onValueChange={(values) => setKmValue(values[0])}
          onValueCommit={(values) => {
            const next = values[0];
            setKmValue(next);
            onKmCommit(next);
          }}
          min={0}
          max={200000}
          step={1}
          className="mb-2"
        />
        <div
          className={`flex justify-between ${typography.tiny} text-muted-foreground`}
        >
          <span>0 km</span>
          <span>{formatKilometraza(kmValue)}</span>
        </div>
      </div>

      {/* Godina */}
      <div>
        <label
          className={`${typography.small} font-medium text-foreground mb-3 block`}
        >
          {t("yearOfProduction")}
        </label>
        <Slider
          value={yearRange}
          onValueChange={(values) => setYearRange([values[0], values[1]])}
          onValueCommit={(values) => {
            const next: RangeTuple = [values[0], values[1]];
            setYearRange(next);
            onYearCommit(next);
          }}
          min={2017}
          max={2025}
          step={1}
          className="mb-2"
        />
        <div
          className={`flex justify-between ${typography.tiny} text-muted-foreground`}
        >
          <span>{yearRange[0]}</span>
          <span>{yearRange[1]}</span>
        </div>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" className="w-full" onClick={onClearFilters}>
          <X className="w-4 h-4 mr-2" />
          {t("clearFilters")} ({activeFiltersCount})
        </Button>
      )}
    </div>
  );
}

const sortOptions = [
  { value: "datum", labelKey: "sortNewest" },
  { value: "cijena-asc", labelKey: "sortPriceAsc" },
  { value: "cijena-desc", labelKey: "sortPriceDesc" },
  { value: "godina-desc", labelKey: "sortYearDesc" },
  { value: "godina-asc", labelKey: "sortYearAsc" },
  { value: "kilometraza-asc", labelKey: "sortMileageAsc" },
];

export default function VozilaClient({
  initialVozila,
}: {
  initialVozila: Vozilo[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("vehicles");

  const initialFilters: FilterOptions = {
    search: searchParams.get("search") || undefined,
    marka: searchParams.get("marka") || undefined,
    model: searchParams.get("model") || undefined,
    gorivo: searchParams.get("gorivo")?.split(",") || [],
    mjenjac: searchParams.get("mjenjac") || undefined,
    godinaOd: searchParams.get("godinaOd")
      ? parseInt(searchParams.get("godinaOd")!)
      : undefined,
    godinaDo: searchParams.get("godinaDo")
      ? parseInt(searchParams.get("godinaDo")!)
      : undefined,
    cijenaOd: searchParams.get("cijenaOd")
      ? parseInt(searchParams.get("cijenaOd")!)
      : undefined,
    cijenaDo: searchParams.get("cijenaDo")
      ? parseInt(searchParams.get("cijenaDo")!)
      : undefined,
    kilometrazaDo: searchParams.get("kilometrazaDo")
      ? parseInt(searchParams.get("kilometrazaDo")!)
      : undefined,
    ekskluzivno:
      searchParams.get("ekskluzivno") === "true" ? true : undefined,
  };
  const initialSort = searchParams.get("sort") || "datum";

  // Pre-fetched on server; avoids bundling JSON in client JS
  const allVozila = useMemo(() => initialVozila, [initialVozila]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isPending, startTransition] = useTransition();
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [searchInput, setSearchInput] = useState(initialFilters.search || "");
  const [sortBy, setSortBy] = useState(initialSort);

  const updateURL = useCallback(
    (newFilters: FilterOptions, newSort: string) => {
      const params = new URLSearchParams();
      if (newFilters.search) params.set("search", newFilters.search);
      if (newFilters.marka) params.set("marka", newFilters.marka);
      if (newFilters.model) params.set("model", newFilters.model);
      if (newFilters.ekskluzivno) params.set("ekskluzivno", "true");
      if (newFilters.gorivo && newFilters.gorivo.length > 0)
        params.set("gorivo", newFilters.gorivo.join(","));
      if (newFilters.mjenjac) params.set("mjenjac", newFilters.mjenjac);
      if (newFilters.godinaOd)
        params.set("godinaOd", newFilters.godinaOd.toString());
      if (newFilters.godinaDo)
        params.set("godinaDo", newFilters.godinaDo.toString());
      if (newFilters.cijenaOd)
        params.set("cijenaOd", newFilters.cijenaOd.toString());
      if (newFilters.cijenaDo && newFilters.cijenaDo < 100000)
        params.set("cijenaDo", newFilters.cijenaDo.toString());
      if (newFilters.kilometrazaDo && newFilters.kilometrazaDo < 200000)
        params.set("kilometrazaDo", newFilters.kilometrazaDo.toString());
      if (newSort !== "datum") params.set("sort", newSort);

      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router]
  );

  // Debounce search to avoid excessive URL updates
  useEffect(() => {
    const normalizedSearch = searchInput.trim() ? searchInput.trim() : undefined;
    if (filters.search === normalizedSearch) {
      return;
    }
    const handler = setTimeout(() => {
      const newFilters = {
        ...filters,
        search: normalizedSearch,
      };
      startTransition(() => setFilters(newFilters));
      updateURL(newFilters, sortBy);
    }, 250);
    return () => clearTimeout(handler);
  }, [filters, searchInput, sortBy, updateURL]);

  // Memoize filtered and sorted vehicles for better performance
  const processedVozila = useMemo(() => {
    const filtered = filterVozila(allVozila, filters);
    return getSortedVozila(filtered, sortBy);
  }, [allVozila, filters, sortBy]);

  const handleMarkaChange = (value: string) => {
    const newMarka = value === "all" ? undefined : value;
    const newFilters = { ...filters, marka: newMarka };
    startTransition(() => setFilters(newFilters));
    updateURL(newFilters, sortBy);
  };

  const handleGorivoChange = (gorivo: string, checked: boolean) => {
    const newGorivo = checked
      ? [...(filters.gorivo || []), gorivo]
      : (filters.gorivo || []).filter((g) => g !== gorivo);
    const newFilters = { ...filters, gorivo: newGorivo };
    startTransition(() => setFilters(newFilters));
    updateURL(newFilters, sortBy);
  };

  const handleMjenjacChange = (value: string) => {
    const newMjenjac = value === "all" ? undefined : value;
    const newFilters = { ...filters, mjenjac: newMjenjac };
    startTransition(() => setFilters(newFilters));
    updateURL(newFilters, sortBy);
  };

  const handlePriceCommit = (values: number[]) => {
    const newFilters = {
      ...filters,
      cijenaOd: values[0] > 0 ? values[0] : undefined,
      cijenaDo: values[1] < 100000 ? values[1] : undefined,
    };
    startTransition(() => setFilters(newFilters));
    updateURL(newFilters, sortBy);
  };

  const handleKmCommit = (value: number) => {
    const newFilters = {
      ...filters,
      kilometrazaDo: value < 200000 ? value : undefined,
    };
    startTransition(() => setFilters(newFilters));
    updateURL(newFilters, sortBy);
  };

  const handleYearCommit = (values: number[]) => {
    const newFilters = {
      ...filters,
      godinaOd: values[0] > 2017 ? values[0] : undefined,
      godinaDo: values[1] < 2025 ? values[1] : undefined,
    };
    startTransition(() => setFilters(newFilters));
    updateURL(newFilters, sortBy);
  };

  const handleSortChange = (value: string) => {
    startTransition(() => setSortBy(value));
    updateURL(filters, value);
  };

  const clearFilters = () => {
    startTransition(() => {
      setFilters({});
      setSortBy("datum");
    });
    setSearchInput("");
    router.push(pathname, { scroll: false });
  };

  const activeFiltersCount = [
    filters.search,
    filters.marka,
    filters.model,
    filters.gorivo?.length,
    filters.mjenjac,
    filters.cijenaOd || filters.cijenaDo,
    filters.kilometrazaDo,
    filters.godinaOd || filters.godinaDo,
    filters.ekskluzivno,
  ].filter(Boolean).length;

  const sliderKey = `${filters.cijenaOd ?? ""}|${filters.cijenaDo ?? ""}|${
    filters.kilometrazaDo ?? ""
  }|${filters.godinaOd ?? ""}|${filters.godinaDo ?? ""}|${
    filters.model ?? ""
  }|${filters.ekskluzivno ?? ""}`;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section
        className={`bg-gradient-to-br from-primary to-primary/80 ${spacing.section.small}`}
      >
        <div className="container mx-auto px-4">
          <FadeIn>
            <h1 className={`${typography.h2} text-white mb-2`}>
              {t("pageTitle")}
            </h1>
            <p className={`${typography.body} text-white/90 mb-4`}>
              {t("pageSubtitle", { count: allVozila.length })}
            </p>
            {/* Search Input */}
            <div className="relative max-w-md">
              <label htmlFor="vozila-search" className="sr-only">
                {t("searchLabel")}
              </label>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
              <Input
                id="vozila-search"
                type="search"
                placeholder={t("searchPlaceholder")}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 bg-card rounded-xl border border-border p-6 max-h-[calc(100vh-120px)] overflow-y-auto filter-scrollbar">
              <h2
                className={`${typography.h4} text-foreground mb-4 flex items-center gap-2`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                {t("filters")}
              </h2>
              <FilterContent
                key={`desktop-${sliderKey}`}
                filters={filters}
                activeFiltersCount={activeFiltersCount}
                onMarkaChange={handleMarkaChange}
                onGorivoChange={handleGorivoChange}
                onMjenjacChange={handleMjenjacChange}
                onPriceCommit={handlePriceCommit}
                onKmCommit={handleKmCommit}
                onYearCommit={handleYearCommit}
                onClearFilters={clearFilters}
                t={t}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter & Sort Bar */}
            <div className="flex items-center justify-between gap-4 mb-6">
              {/* Mobile Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="outline" className="gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    {t("filters")}
                    {activeFiltersCount > 0 && (
                      <Badge className="bg-primary text-primary-foreground ml-1">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>{t("filters")}</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent
                      key={`mobile-${sliderKey}`}
                      filters={filters}
                      activeFiltersCount={activeFiltersCount}
                      onMarkaChange={handleMarkaChange}
                      onGorivoChange={handleGorivoChange}
                      onMjenjacChange={handleMjenjacChange}
                      onPriceCommit={handlePriceCommit}
                      onKmCommit={handleKmCommit}
                      onYearCommit={handleYearCommit}
                      onClearFilters={clearFilters}
                      t={t}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Results Count */}
              <p
                className="text-sm text-muted-foreground hidden sm:block"
                aria-live="polite"
                aria-atomic="true"
              >
                {t("vehiclesCount", { count: processedVozila.length })}
              </p>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center gap-1 border border-border rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                  aria-label={t("viewModeGrid")}
                  aria-pressed={viewMode === "grid"}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                  aria-label={t("viewModeList")}
                  aria-pressed={viewMode === "list"}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {t(option.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters Tags */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.marka && (
                  <Badge variant="secondary" className="gap-1">
                    {filters.marka}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => handleMarkaChange("all")}
                    />
                  </Badge>
                )}
                {filters.gorivo?.map((g) => (
                  <Badge key={g} variant="secondary" className="gap-1">
                    {GORIVA.find((go) => go.value === g)?.label}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => handleGorivoChange(g, false)}
                    />
                  </Badge>
                ))}
                {filters.model && (
                  <Badge variant="secondary" className="gap-1">
                    {filters.model}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() =>
                        startTransition(() =>
                          setFilters({ ...filters, model: undefined })
                        )
                      }
                    />
                  </Badge>
                )}
                {filters.mjenjac && (
                  <Badge variant="secondary" className="gap-1">
                    {
                      MJENJACI.find((m) => m.value === filters.mjenjac)?.label
                    }
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => handleMjenjacChange("all")}
                    />
                  </Badge>
                )}
                {(filters.cijenaOd || filters.cijenaDo) && (
                  <Badge variant="secondary" className="gap-1">
                    {formatCijena(filters.cijenaOd || 0)} -{" "}
                    {filters.cijenaDo ? formatCijena(filters.cijenaDo) : "100.000 EUR"}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() =>
                        handlePriceCommit([0, filters.cijenaDo ?? 100000])
                      }
                    />
                  </Badge>
                )}
                {(filters.godinaOd || filters.godinaDo) && (
                  <Badge variant="secondary" className="gap-1">
                    {filters.godinaOd || 2017} - {filters.godinaDo || 2025}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => handleYearCommit([2017, 2025])}
                    />
                  </Badge>
                )}
                {filters.kilometrazaDo && (
                  <Badge variant="secondary" className="gap-1">
                    {"<="} {formatKilometraza(filters.kilometrazaDo)}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => handleKmCommit(200000)}
                    />
                  </Badge>
                )}
                {filters.ekskluzivno && (
                  <Badge variant="secondary" className="gap-1">
                    {t("exclusiveOnly")}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() =>
                        startTransition(() =>
                          setFilters({ ...filters, ekskluzivno: undefined })
                        )
                      }
                    />
                  </Badge>
                )}
              </div>
            )}

            {/* Vehicle Grid/List */}
            {isPending ? (
              // Loading skeleton during filter
              viewMode === "grid" ? (
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${spacing.gap.default}`}
                >
                  {Array.from({ length: 8 }).map((_, index) => (
                    <VehicleCardSkeleton key={index} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <VehicleCardSkeleton key={index} variant="list" />
                  ))}
                </div>
              )
            ) : processedVozila.length > 0 ? (
              viewMode === "grid" ? (
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${spacing.gap.default}`}
                >
                  {processedVozila.map((vozilo, index) => (
                    <VoziloCard key={vozilo.id} vozilo={vozilo} index={index} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {processedVozila.map((vozilo, index) => (
                    <VoziloListItem
                      key={vozilo.id}
                      vozilo={vozilo}
                      index={index}
                    />
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-16">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-md mx-auto"
                >
                  {/* Empty State SVG Illustration */}
                  <svg
                    className="w-48 h-48 mx-auto mb-6"
                    viewBox="0 0 200 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Car body */}
                    <path
                      d="M30 120 L50 90 L150 90 L170 120 L170 140 L30 140 Z"
                      className="fill-muted stroke-muted-foreground/30"
                      strokeWidth="2"
                    />
                    {/* Car roof */}
                    <path
                      d="M60 90 L75 60 L125 60 L140 90"
                      className="fill-muted stroke-muted-foreground/30"
                      strokeWidth="2"
                    />
                    {/* Windows */}
                    <path
                      d="M65 88 L78 65 L98 65 L98 88 Z"
                      className="fill-background stroke-muted-foreground/20"
                      strokeWidth="1"
                    />
                    <path
                      d="M102 88 L102 65 L122 65 L135 88 Z"
                      className="fill-background stroke-muted-foreground/20"
                      strokeWidth="1"
                    />
                    {/* Wheels */}
                    <circle
                      cx="60"
                      cy="140"
                      r="18"
                      className="fill-muted-foreground/20"
                    />
                    <circle
                      cx="60"
                      cy="140"
                      r="10"
                      className="fill-background"
                    />
                    <circle
                      cx="140"
                      cy="140"
                      r="18"
                      className="fill-muted-foreground/20"
                    />
                    <circle
                      cx="140"
                      cy="140"
                      r="10"
                      className="fill-background"
                    />
                    {/* Magnifying glass */}
                    <circle
                      cx="155"
                      cy="55"
                      r="28"
                      className="fill-accent/10 stroke-accent/40"
                      strokeWidth="4"
                    />
                    <line
                      x1="175"
                      y1="75"
                      x2="195"
                      y2="95"
                      className="stroke-accent/40"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    {/* Question mark in magnifying glass */}
                    <text
                      x="155"
                      y="62"
                      textAnchor="middle"
                      className="fill-accent/60 text-2xl font-bold"
                      style={{ fontSize: "24px" }}
                    >
                      ?
                    </text>
                  </svg>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t("noResults")}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {t("noResultsDescription")}
                  </p>
                  <Button
                    onClick={clearFilters}
                    variant="gradient"
                    size="lg"
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    {t("clearAllFilters")}
                  </Button>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

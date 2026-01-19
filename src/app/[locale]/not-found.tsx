"use client";

import { Car, Home, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const t = useTranslations("common.notFound");

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="relative mb-8">
          <div className="text-[150px] font-bold text-accent/20 dark:text-accent/30 leading-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-accent/10 dark:bg-accent/20 flex items-center justify-center">
              <Car className="w-12 h-12 text-accent" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          {t("title")}
        </h1>
        <p className="text-muted-foreground mb-8">{t("description")}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="gap-2 w-full sm:w-auto">
              <Home className="w-5 h-5" />
              {t("home")}
            </Button>
          </Link>
          <Link href="/vozila">
            <Button
              size="lg"
              variant="outline"
              className="gap-2 w-full sm:w-auto"
            >
              <Search className="w-5 h-5" />
              {t("searchVehicles")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

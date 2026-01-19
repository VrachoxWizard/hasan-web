"use client";

import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const localeNames: Record<Locale, string> = {
  hr: "Hrvatski",
  en: "English",
  de: "Deutsch",
  fr: "Français",
};

const localeFlags: Record<Locale, string> = {
  hr: "🇭🇷",
  en: "🇬🇧",
  de: "🇩🇪",
  fr: "🇫🇷",
};

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleLocaleChange = (newLocale: Locale) => {
    const queryString = searchParams.toString();
    const target = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(target, { locale: newLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="cursor-pointer h-9 px-2 gap-1.5 text-foreground/60 hover:text-foreground hover:bg-accent/10 dark:text-white/80 dark:hover:text-white dark:hover:bg-white/10 rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm hidden sm:inline">
            {localeFlags[locale]}
          </span>
          <span className="text-xs font-medium uppercase">{locale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {routing.locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className="flex items-center justify-between gap-2 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span>{localeFlags[loc]}</span>
              <span>{localeNames[loc]}</span>
            </div>
            {locale === loc && <Check className="w-4 h-4 text-accent" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

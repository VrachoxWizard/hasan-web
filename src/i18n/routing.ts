import { defineRouting } from "next-intl/routing";

export const locales = ["hr", "en", "de", "fr"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "hr",
  localePrefix: "as-needed", // No prefix for Croatian (default), /en/, /de/, /fr/ for others
});

export type { Locale as LocaleType };

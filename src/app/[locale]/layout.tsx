import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import StoreHydration from "@/components/StoreHydration";
import FloatingOverlays from "@/components/FloatingOverlays";

import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const siteUrl =
    (
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.SITE_URL ||
      "https://produktauto.com"
    )?.replace(/\/$/, "") || "https://produktauto.com";

  const titles: Record<string, string> = {
    hr: "Produkt Auto - Kvalitetna rabljena vozila",
    en: "Produkt Auto - Quality Used Vehicles",
    de: "Produkt Auto - Qualitäts-Gebrauchtwagen",
    fr: "Produkt Auto - Véhicules d'occasion de qualité",
  };

  const descriptions: Record<string, string> = {
    hr: "Vaš pouzdani partner za kupnju kvalitetnih rabljenih vozila u Hrvatskoj. Pregledajte našu ponudu premium automobila s jamstvom kvalitete.",
    en: "Your reliable partner for buying quality used vehicles in Croatia. Browse our selection of premium cars with quality guarantee.",
    de: "Ihr zuverlässiger Partner für den Kauf von Qualitäts-Gebrauchtwagen in Kroatien. Durchsuchen Sie unsere Auswahl an Premium-Autos mit Qualitätsgarantie.",
    fr: "Votre partenaire fiable pour acheter des véhicules d'occasion de qualité en Croatie. Découvrez notre sélection de voitures premium avec garantie de qualité.",
  };

  const ogLocales: Record<string, string> = {
    hr: "hr_HR",
    en: "en_US",
    de: "de_DE",
    fr: "fr_FR",
  };

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: titles[locale] || titles.hr,
      template: "%s | Produkt Auto",
    },
    description: descriptions[locale] || descriptions.hr,
    keywords: [
      "rabljena vozila",
      "prodaja automobila",
      "auto salon",
      "Zagreb",
      "Hrvatska",
      "BMW",
      "Mercedes",
      "Audi",
      "Volkswagen",
    ],
    authors: [{ name: "Produkt Auto" }],
    alternates: {
      canonical: locale === "hr" ? "/" : `/${locale}`,
      languages: {
        hr: "/",
        en: "/en",
        de: "/de",
        fr: "/fr",
      },
    },
    openGraph: {
      type: "website",
      locale: ogLocales[locale] || ogLocales.hr,
      siteName: "Produkt Auto",
      url: locale === "hr" ? "/" : `/${locale}`,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate that the incoming locale is valid
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client side
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme - dark mode is default */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem('produktauto-theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const isLight = stored === 'light' || (stored === 'system' && !prefersDark);
                  if (!isLight) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh flex flex-col`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            storageKey="produktauto-theme"
            enableSystem
            disableTransitionOnChange
          >
            <StoreHydration />
            {/* Skip to main content link for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-lg focus:font-semibold"
            >
              {locale === "en"
                ? "Skip to main content"
                : locale === "fr"
                ? "Aller au contenu principal"
                : locale === "de"
                ? "Zum Hauptinhalt springen"
                : "Preskoči na glavni sadržaj"}
            </a>

            <Header />
            <ErrorBoundary>
              <main id="main-content" className="flex-1 pt-16 md:pt-20">
                {children}
              </main>
            </ErrorBoundary>
            <Footer />
            <FloatingOverlays />
            <Toaster position="bottom-right" richColors />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

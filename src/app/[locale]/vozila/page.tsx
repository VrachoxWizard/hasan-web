import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { getVozilaDb } from "@/lib/vozilaDb";
import VozilaClient from "./VozilaClient";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

const vehiclesAlternates = {
  hr: "/vozila",
  en: "/en/vozila",
  de: "/de/vozila",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "vehicles" });
  const title = t("pageTitle");
  const description = t("pageDescription");

  return {
    title,
    description,
    alternates: {
      canonical:
        vehiclesAlternates[locale as keyof typeof vehiclesAlternates] ||
        vehiclesAlternates.hr,
      languages: vehiclesAlternates,
    },
    openGraph: {
      title,
      description,
    },
  };
}

// CMS-driven data (no stale caching)
export const revalidate = 0;

export default async function VozilaPage() {
  const allVozila = await getVozilaDb();
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <VozilaClient initialVozila={allVozila} />
    </Suspense>
  );
}

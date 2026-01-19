import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import PrivatnostClient from "./PrivatnostClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
    },
  };
}

export default async function PrivatnostPage({ params }: Props) {
  const { locale } = await params;
  await setRequestLocale(locale);

  return <PrivatnostClient />;
}
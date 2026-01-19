import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import UsporediClient from "./UsporediClient";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "compare" });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function UsporediPage({ params }: Props) {
  const { locale } = await params;
  await setRequestLocale(locale);

  return <UsporediClient />;
}
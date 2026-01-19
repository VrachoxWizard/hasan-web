import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/JsonLd";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://produktauto.com";
  const localizedUrl = locale === "hr" ? siteUrl : `${siteUrl}/${locale}`;

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: {
      canonical: localizedUrl,
      languages: {
        hr: siteUrl,
        en: `${siteUrl}/en`,
        de: `${siteUrl}/de`,
      },
    },
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      url: localizedUrl,
      siteName: "Produkt Auto",
      type: "website",
      locale: locale === "hr" ? "hr_HR" : locale === "de" ? "de_DE" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: t("meta.title"),
      description: t("meta.description"),
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  await setRequestLocale(locale);

  return (
    <>
      <OrganizationJsonLd />
      <WebsiteJsonLd />
      <HomeClient />
    </>
  );
}

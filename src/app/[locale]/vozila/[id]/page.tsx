import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVozilaDb, getVoziloByIdDb } from "@/lib/vozilaDb";
import VoziloDetailClient from "@/components/VoziloDetailClient";
import { VehicleJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const vozilo = await getVoziloByIdDb(id);

  if (!vozilo) {
    return {
      title: "Vozilo nije pronađeno | Produkt Auto",
      description: "Traženo vozilo ne postoji ili je uklonjeno.",
    };
  }

  const title = `${vozilo.marka} ${vozilo.model} (${vozilo.godina})`;
  const description =
    vozilo.opis.length > 160 ? `${vozilo.opis.slice(0, 157)}...` : vozilo.opis;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: vozilo.slike?.[0] ? [vozilo.slike[0]] : undefined,
    },
  };
}

// Map Croatian fuel types to English for schema.org
const fuelTypeMap: Record<string, string> = {
  benzin: "Gasoline",
  dizel: "Diesel",
  hibrid: "HybridElectric",
  elektricni: "Electric",
};

// Map Croatian transmission to English for schema.org
const transmissionMap: Record<string, string> = {
  rucni: "ManualTransmission",
  automatski: "AutomaticTransmission",
};

export default async function VoziloDetailPage({ params }: Props) {
  const { id, locale } = await params;
  const vozilo = await getVoziloByIdDb(id);

  if (!vozilo) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://produktauto.com";
  const vehicleUrl =
    locale === "hr"
      ? `${siteUrl}/vozila/${id}`
      : `${siteUrl}/${locale}/vozila/${id}`;

  const breadcrumbItems = [
    { name: "Početna", url: siteUrl },
    { name: "Vozila", url: `${siteUrl}/vozila` },
    { name: `${vozilo.marka} ${vozilo.model}`, url: vehicleUrl },
  ];

  return (
    <>
      <VehicleJsonLd
        name={`${vozilo.marka} ${vozilo.model} ${vozilo.godina}`}
        description={vozilo.opis}
        image={vozilo.slike || []}
        brand={vozilo.marka}
        model={vozilo.model}
        year={vozilo.godina}
        mileage={vozilo.kilometraza}
        fuelType={fuelTypeMap[vozilo.gorivo] || vozilo.gorivo}
        transmission={transmissionMap[vozilo.mjenjac] || vozilo.mjenjac}
        price={vozilo.cijena}
        currency="EUR"
        url={vehicleUrl}
        color={vozilo.boja}
        power={vozilo.snaga}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <VoziloDetailClient vozilo={vozilo} />
    </>
  );
}

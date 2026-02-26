import { CONTACT, WORKING_HOURS, COMPANY } from "@/lib/constants";

type JsonLdProps = {
  type: "organization" | "autodealer" | "vehicle" | "breadcrumb";
  data?: Record<string, unknown>;
};

export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "@id": "https://produktauto.com/#organization",
    name: COMPANY.legalName,
    alternateName: COMPANY.name,
    description: COMPANY.description,
    url: "https://produktauto.com",
    logo: "https://produktauto.com/logo.png",
    image: "https://produktauto.com/og-image.jpg",
    telephone: CONTACT.phone,
    email: CONTACT.email,
    foundingDate: COMPANY.founded.toString(),
    vatID: CONTACT.address.vat,
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.address.street,
      addressLocality: CONTACT.address.city,
      postalCode: CONTACT.address.postalCode,
      addressCountry: "HR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: CONTACT.geo.latitude,
      longitude: CONTACT.geo.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: WORKING_HOURS.weekdays.open,
        closes: WORKING_HOURS.weekdays.close,
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: WORKING_HOURS.saturday.open,
        closes: WORKING_HOURS.saturday.close,
      },
    ],
    sameAs: [
      CONTACT.social.facebook,
      CONTACT.social.instagram,
      CONTACT.social.youtube,
    ],
    priceRange: "€€",
    currenciesAccepted: "EUR",
    paymentAccepted: "Cash, Credit Card, Bank Transfer",
    areaServed: {
      "@type": "Country",
      name: "Croatia",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Used Vehicles",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Premium Used Cars",
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

type VehicleJsonLdProps = {
  name: string;
  description: string;
  image: string[];
  brand: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  price: number;
  currency?: string;
  url: string;
  vin?: string;
  color?: string;
  engineSize?: number;
  power?: number;
};

export function VehicleJsonLd({
  name,
  description,
  image,
  brand,
  model,
  year,
  mileage,
  fuelType,
  transmission,
  price,
  currency = "EUR",
  url,
  vin,
  color,
  engineSize,
  power,
}: VehicleJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name,
    description,
    image,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    model,
    vehicleModelDate: year.toString(),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: mileage,
      unitCode: "KMT",
    },
    fuelType,
    vehicleTransmission: transmission,
    ...(vin && { vehicleIdentificationNumber: vin }),
    ...(color && { color }),
    ...(engineSize && {
      vehicleEngine: {
        "@type": "EngineSpecification",
        engineDisplacement: {
          "@type": "QuantitativeValue",
          value: engineSize,
          unitCode: "CMQ",
        },
      },
    }),
    ...(power && {
      vehicleEngine: {
        "@type": "EngineSpecification",
        enginePower: {
          "@type": "QuantitativeValue",
          value: power,
          unitCode: "KWT",
        },
      },
    }),
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "AutoDealer",
        name: COMPANY.legalName,
        url: "https://produktauto.com",
      },
      url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

type BreadcrumbItem = {
  name: string;
  url: string;
};

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebsiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://produktauto.com/#website",
    name: COMPANY.name,
    url: "https://produktauto.com",
    publisher: {
      "@id": "https://produktauto.com/#organization",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://produktauto.com/vozila?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

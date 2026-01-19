export interface Vozilo {
  id: string;
  marka: string;
  model: string;
  godina: number;
  cijena: number;
  staracijena?: number; // Original price before discount
  kilometraza: number;
  gorivo: "benzin" | "dizel" | "hibrid" | "elektricni";
  mjenjac: "rucni" | "automatski";
  snaga: number; // in kW
  boja: string;
  opis: string;
  slike: string[];
  istaknuto: boolean;
  ekskluzivno?: boolean; // Exclusive offer badge
  datumObjave: string;
  karakteristike: string[];
}

export interface FilterOptions {
  search?: string;
  marka?: string;
  model?: string;
  godinaOd?: number;
  godinaDo?: number;
  cijenaOd?: number;
  cijenaDo?: number;
  gorivo?: string[];
  kilometrazaDo?: number;
  mjenjac?: string;
   ekskluzivno?: boolean;
}

export const MARKE = [
  "Audi",
  "BMW",
  "Citroën",
  "DS",
  "Ford",
  "Kia",
  "Nissan",
  "Opel",
  "Peugeot",
  "Renault",
  "Seat",
  "Škoda",
  "Volkswagen",
] as const;

export const MODELI_PO_MARKI: Record<string, string[]> = {
  Audi: ["A2", "A3", "A4", "A5", "A6", "A8", "Q2", "Q3", "Q5", "Q7", "SQ5"],
  BMW: [
    "1 Series",
    "2 Series",
    "3 Series",
    "4 Series",
    "5 Series",
    "6 Series",
    "7 Series",
    "8 Series",
    "X1",
    "X2",
    "X3",
    "X4",
    "X5",
    "X6",
    "X7",
    "i3",
    "i4",
    "iX",
    "iX1",
    "iX3",
    "i7",
  ],
  Citroën: [
    "C3",
    "C3 Aircross",
    "C4",
    "C4 Cactus",
    "C4 Picasso",
    "C4 Grand Picasso",
    "C4 SpaceTourer",
    "C5",
    "C5 Aircross",
  ],
  DS: ["DS4", "DS5", "DS7 Crossback"],
  Ford: ["Fiesta", "Focus", "Puma", "Kuga", "Explorer", "Galaxy"],
  Kia: ["Sportage", "Stinger", "Soul", "Sorento", "Stonic"],
  Nissan: ["Juke", "Qashqai", "X-Trail", "Note"],
  Opel: ["Corsa", "Astra", "Crossland", "Grandland", "Zafira"],
  Peugeot: ["208", "2008", "308", "308 SW", "508", "508 SW", "3008", "5008"],
  Renault: [
    "Captur",
    "Clio",
    "Grand Scenic",
    "Kadjar",
    "Kangoo",
    "Megane",
    "Scenic",
  ],
  Seat: ["Ateca", "Arona", "Leon"],
  Škoda: ["Karoq", "Kodiaq", "Octavia", "Fabia", "Scala", "Superb"],
  Volkswagen: [
    "Arteon",
    "Caddy",
    "CC",
    "Golf",
    "Passat",
    "Sharan",
    "Tiguan",
    "Transporter",
    "T-Roc",
  ],
};

export const GODINE = [
  2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017,
] as const;

export const CJENOVNI_PRAGOVI = [
  { value: "0-15000", label: "0–15.000 €", min: 0, max: 15000 },
  { value: "15000-30000", label: "15.000–30.000 €", min: 15000, max: 30000 },
  { value: "30000-60000", label: "30.000–60.000 €", min: 30000, max: 60000 },
  {
    value: "60000-100000",
    label: "60.000–100.000 €",
    min: 60000,
    max: 100000,
  },
] as const;

export const GORIVA = [
  { value: "benzin", label: "Benzin" },
  { value: "dizel", label: "Dizel" },
  { value: "hibrid", label: "Hibrid" },
  { value: "elektricni", label: "Električni" },
] as const;

export const MJENJACI = [
  { value: "rucni", label: "Ručni" },
  { value: "automatski", label: "Automatski" },
] as const;

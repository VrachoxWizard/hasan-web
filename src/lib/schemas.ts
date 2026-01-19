import { z } from "zod";

/**
 * Zod Schemas for Produkt Auto
 * Centralized validation with Croatian error messages
 */

// Contact Form Schema (localized)
const contactMessages = {
  hr: {
    required: "Ovo polje je obavezno",
    nameMin: "Ime mora imati minimalno 2 znaka",
    nameMax: "Ime ne smije biti duže od 100 znakova",
    email: "Email nije valjan",
    phone: "Broj telefona nije valjan",
    messageMin: "Poruka mora imati minimalno 10 znakova",
    messageMax: "Poruka ne smije biti duža od 1000 znakova",
  },
  en: {
    required: "This field is required",
    nameMin: "Name must be at least 2 characters",
    nameMax: "Name must not exceed 100 characters",
    email: "Email is not valid",
    phone: "Phone number is not valid",
    messageMin: "Message must be at least 10 characters",
    messageMax: "Message must not exceed 1000 characters",
  },
  de: {
    required: "Dieses Feld ist erforderlich",
    nameMin: "Name muss mindestens 2 Zeichen lang sein",
    nameMax: "Name darf 100 Zeichen nicht ueberschreiten",
    email: "E-Mail ist nicht gueltig",
    phone: "Telefonnummer ist nicht gueltig",
    messageMin: "Nachricht muss mindestens 10 Zeichen haben",
    messageMax: "Nachricht darf 1000 Zeichen nicht ueberschreiten",
  },
  fr: {
    required: "Ce champ est obligatoire",
    nameMin: "Le nom doit contenir au moins 2 caractères",
    nameMax: "Le nom ne doit pas dépasser 100 caractères",
    email: "L'adresse e-mail n'est pas valide",
    phone: "Le numéro de téléphone n'est pas valide",
    messageMin: "Le message doit contenir au moins 10 caractères",
    messageMax: "Le message ne doit pas dépasser 1000 caractères",
  },
} as const;

type ContactLocale = keyof typeof contactMessages;

export const getContactFormSchema = (locale: string) => {
  const m =
    contactMessages[(locale as ContactLocale) || "hr"] || contactMessages.hr;
  return z.object({
    ime: z.string().min(1, m.required).min(2, m.nameMin).max(100, m.nameMax),
    email: z.string().min(1, m.required).email(m.email),
    telefon: z
      .string()
      .min(1, m.required)
      .regex(/^\+?[\d\s-]{9,}$/, m.phone),
    budzet: z.string().optional(),
    poruka: z
      .string()
      .min(1, m.required)
      .min(10, m.messageMin)
      .max(1000, m.messageMax),
    hp: z.string().optional(),
  });
};

export const contactFormSchema = getContactFormSchema("hr");

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Vehicle Inquiry Form Schema (for vehicle detail page)
export const vehicleInquirySchema = z.object({
  ime: z
    .string()
    .min(1, "Ovo polje je obavezno")
    .min(2, "Ime mora imati minimalno 2 znaka")
    .max(100, "Ime ne smije biti duže od 100 znakova"),
  email: z.string().min(1, "Ovo polje je obavezno").email("Email nije valjan"),
  telefon: z
    .string()
    .min(1, "Ovo polje je obavezno")
    .regex(/^\+?[\d\s-]{9,}$/, "Broj telefona nije valjan"),
  poruka: z
    .string()
    .min(10, "Poruka mora imati minimalno 10 znakova")
    .max(1000, "Poruka ne smije biti duža od 1000 znakova"),
});

export type VehicleInquiryData = z.infer<typeof vehicleInquirySchema>;

// Vozilo Data Schema (for validating vozila.json)
export const voziloSchema = z.object({
  id: z.string().min(1, "ID je obavezan"),
  marka: z.string().min(1, "Marka je obavezna"),
  model: z.string().min(1, "Model je obavezan"),
  godina: z
    .number()
    .int()
    .min(1990, "Godina mora biti između 1990 i 2025")
    .max(2025, "Godina mora biti između 1990 i 2025"),
  cijena: z.number().positive("Cijena mora biti pozitivan broj"),
  staracijena: z.number().positive().optional(),
  kilometraza: z.number().nonnegative("Kilometraža ne može biti negativna"),
  gorivo: z.enum(["benzin", "dizel", "hibrid", "elektricni"], {
    message: "Nevaljan tip goriva",
  }),
  mjenjac: z.enum(["rucni", "automatski"], {
    message: "Nevaljan tip mjenjača",
  }),
  snaga: z.number().positive("Snaga mora biti pozitivan broj"),
  boja: z.string().min(1, "Boja je obavezna"),
  opis: z.string().min(10, "Opis mora imati minimalno 10 znakova"),
  slike: z
    .array(z.string().url("Svaka slika mora biti valjani URL"))
    .min(1, "Vozilo mora imati minimalno jednu sliku"),
  istaknuto: z.boolean(),
  ekskluzivno: z.boolean().optional(),
  datumObjave: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Datum mora biti u formatu YYYY-MM-DD"),
  karakteristike: z
    .array(z.string())
    .min(1, "Vozilo mora imati minimalno jednu karakteristiku"),
});

export type VoziloValidated = z.infer<typeof voziloSchema>;

// Helper function to validate vozila array
export function validateVozila(data: unknown[]): {
  valid: VoziloValidated[];
  errors: Array<{ index: number; error: string }>;
} {
  const valid: VoziloValidated[] = [];
  const errors: Array<{ index: number; error: string }> = [];

  data.forEach((item, index) => {
    const result = voziloSchema.safeParse(item);
    if (result.success) {
      valid.push(result.data);
    } else {
      const errorMessages = result.error.issues
        .map((e: z.ZodIssue) => `${e.path.join(".")}: ${e.message}`)
        .join(", ");
      errors.push({ index, error: errorMessages });
    }
  });

  return { valid, errors };
}

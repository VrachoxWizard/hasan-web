import { describe, it, expect } from "vitest";
import {
  contactFormSchema,
  vehicleInquirySchema,
  voziloSchema,
  validateVozila,
} from "@/lib/schemas";
import { z } from "zod";

describe("Contact Form Schema", () => {
  it("should validate correct contact form data", () => {
    const validData = {
      ime: "Marko Marić",
      email: "marko@example.com",
      telefon: "+385911234567",
      budzet: "15000-25000",
      poruka: "Zanima me vozilo BMW 3 Series.",
    };

    const result = contactFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject empty name", () => {
    const invalidData = {
      ime: "",
      email: "test@example.com",
      telefon: "+385911234567",
      poruka: "Test message here.",
    };

    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("obavezno");
    }
  });

  it("should reject name with less than 2 characters", () => {
    const invalidData = {
      ime: "A",
      email: "test@example.com",
      telefon: "+385911234567",
      poruka: "Test message here.",
    };

    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("2 znaka");
    }
  });

  it("should reject invalid email format", () => {
    const invalidData = {
      ime: "Test User",
      email: "invalid-email",
      telefon: "+385911234567",
      poruka: "Test message here.",
    };

    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((e: z.ZodIssue) => e.path[0] === "email")
      ).toBe(true);
    }
  });

  it("should reject invalid phone number", () => {
    const invalidData = {
      ime: "Test User",
      email: "test@example.com",
      telefon: "123",
      poruka: "Test message here.",
    };

    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((e: z.ZodIssue) => e.path[0] === "telefon")
      ).toBe(true);
    }
  });

  it("should reject short message", () => {
    const invalidData = {
      ime: "Test User",
      email: "test@example.com",
      telefon: "+385911234567",
      poruka: "Short",
    };

    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("10 znakova");
    }
  });

  it("should accept optional budget field", () => {
    const validData = {
      ime: "Test User",
      email: "test@example.com",
      telefon: "+385911234567",
      poruka: "Test message here.",
    };

    const result = contactFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});

describe("Vehicle Inquiry Schema", () => {
  it("should validate correct vehicle inquiry data", () => {
    const validData = {
      ime: "Marko Marić",
      email: "marko@example.com",
      telefon: "+385911234567",
      poruka: "Zanima me ovo vozilo.",
    };

    const result = vehicleInquirySchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject invalid data", () => {
    const invalidData = {
      ime: "A",
      email: "invalid",
      telefon: "123",
      poruka: "Short",
    };

    const result = vehicleInquirySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });
});

describe("Vozilo Schema", () => {
  const validVozilo = {
    id: "bmw-3-series",
    marka: "BMW",
    model: "3 Series",
    godina: 2020,
    cijena: 35000,
    kilometraza: 50000,
    gorivo: "dizel",
    mjenjac: "automatski",
    snaga: 140,
    boja: "Crna",
    opis: "Odlično očuvano vozilo sa servisnom knjižicom.",
    slike: ["https://example.com/image1.jpg"],
    istaknuto: true,
    datumObjave: "2024-01-01",
    karakteristike: ["LED svjetla", "Kožna sjedala"],
  };

  it("should validate correct vozilo data", () => {
    const result = voziloSchema.safeParse(validVozilo);
    expect(result.success).toBe(true);
  });

  it("should reject missing required fields", () => {
    const invalidVozilo = {
      id: "test",
      marka: "BMW",
      // missing other required fields
    };

    const result = voziloSchema.safeParse(invalidVozilo);
    expect(result.success).toBe(false);
  });

  it("should reject invalid godina (year out of range)", () => {
    const invalidVozilo = {
      ...validVozilo,
      godina: 1980,
    };

    const result = voziloSchema.safeParse(invalidVozilo);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("godina");
    }
  });

  it("should reject invalid gorivo type", () => {
    const invalidVozilo = {
      ...validVozilo,
      gorivo: "invalid",
    };

    const result = voziloSchema.safeParse(invalidVozilo);
    expect(result.success).toBe(false);
  });

  it("should reject invalid mjenjac type", () => {
    const invalidVozilo = {
      ...validVozilo,
      mjenjac: "invalid",
    };

    const result = voziloSchema.safeParse(invalidVozilo);
    expect(result.success).toBe(false);
  });

  it("should reject negative cijena", () => {
    const invalidVozilo = {
      ...validVozilo,
      cijena: -1000,
    };

    const result = voziloSchema.safeParse(invalidVozilo);
    expect(result.success).toBe(false);
  });

  it("should reject negative kilometraza", () => {
    const invalidVozilo = {
      ...validVozilo,
      kilometraza: -500,
    };

    const result = voziloSchema.safeParse(invalidVozilo);
    expect(result.success).toBe(false);
  });

  it("should accept valid optional fields", () => {
    const voziloWithOptionals = {
      ...validVozilo,
      staracijena: 40000,
      ekskluzivno: true,
    };

    const result = voziloSchema.safeParse(voziloWithOptionals);
    expect(result.success).toBe(true);
  });

  it("should reject invalid date format", () => {
    const invalidVozilo = {
      ...validVozilo,
      datumObjave: "2024/01/01",
    };

    const result = voziloSchema.safeParse(invalidVozilo);
    expect(result.success).toBe(false);
  });

  it("should reject empty slike array", () => {
    const invalidVozilo = {
      ...validVozilo,
      slike: [],
    };

    const result = voziloSchema.safeParse(invalidVozilo);
    expect(result.success).toBe(false);
  });

  it("should reject empty karakteristike array", () => {
    const invalidVozilo = {
      ...validVozilo,
      karakteristike: [],
    };

    const result = voziloSchema.safeParse(invalidVozilo);
    expect(result.success).toBe(false);
  });
});

describe("validateVozila helper", () => {
  const validVozilo = {
    id: "test-1",
    marka: "BMW",
    model: "3 Series",
    godina: 2020,
    cijena: 35000,
    kilometraza: 50000,
    gorivo: "dizel",
    mjenjac: "automatski",
    snaga: 140,
    boja: "Crna",
    opis: "Test description",
    slike: ["https://example.com/image.jpg"],
    istaknuto: true,
    datumObjave: "2024-01-01",
    karakteristike: ["LED svjetla"],
  };

  it("should validate array of vozila", () => {
    const data = [validVozilo];
    const result = validateVozila(data);

    expect(result.valid.length).toBe(1);
    expect(result.errors.length).toBe(0);
  });

  it("should separate valid and invalid vozila", () => {
    const data = [
      validVozilo,
      { id: "invalid", marka: "Test" }, // Invalid - missing fields
    ];

    const result = validateVozila(data);

    expect(result.valid.length).toBe(1);
    expect(result.errors.length).toBe(1);
    expect(result.errors[0].index).toBe(1);
  });

  it("should return all valid vozila when data is correct", () => {
    const data = [validVozilo, { ...validVozilo, id: "test-2" }];
    const result = validateVozila(data);

    expect(result.valid.length).toBe(2);
    expect(result.errors.length).toBe(0);
  });

  it("should provide detailed error messages", () => {
    const data = [{ id: "test", marka: "BMW" }];
    const result = validateVozila(data);

    expect(result.errors.length).toBe(1);
    expect(result.errors[0].error).toBeTruthy();
    expect(typeof result.errors[0].error).toBe("string");
  });
});

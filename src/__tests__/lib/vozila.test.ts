import { describe, it, expect } from "vitest";
import {
  formatCijena,
  formatKilometraza,
  formatSnaga,
  getGorivoLabel,
  getMjenjacLabel,
  filterVozila,
  getSortedVozila,
} from "@/lib/vozila";
import { Vozilo, FilterOptions } from "@/types/vozilo";

describe("vozila utility functions", () => {
  describe("formatCijena", () => {
    it("should format price correctly with EUR symbol", () => {
      expect(formatCijena(25000)).toContain("25");
      expect(formatCijena(25000)).toContain("000");
      expect(formatCijena(25000)).toContain("€");
      expect(formatCijena(10500)).toContain("10");
      expect(formatCijena(10500)).toContain("500");
    });

    it("should handle zero and negative values", () => {
      expect(formatCijena(0)).toContain("0");
      expect(formatCijena(0)).toContain("€");
      // Negative numbers may use minus sign (−) or hyphen (-)
      const negativeResult = formatCijena(-1000);
      expect(negativeResult).toMatch(/[-−]1/);
      expect(negativeResult).toContain("000");
    });

    it("should not show decimal places", () => {
      const result = formatCijena(25000.99);
      expect(result).toContain("€");
      // Should round to nearest integer (25.001)
      expect(result).toContain("25");
      expect(result).toContain("001");
    });
  });

  describe("formatKilometraza", () => {
    it("should format mileage with km suffix", () => {
      expect(formatKilometraza(150000)).toBe("150.000 km");
      expect(formatKilometraza(50000)).toBe("50.000 km");
      expect(formatKilometraza(999)).toBe("999 km");
    });

    it("should handle zero mileage", () => {
      expect(formatKilometraza(0)).toBe("0 km");
    });
  });

  describe("formatSnaga", () => {
    it("should convert kW to KS correctly", () => {
      expect(formatSnaga(100)).toContain("100 kW");
      expect(formatSnaga(100)).toContain("136 KS");
    });

    it("should round KS to nearest integer", () => {
      expect(formatSnaga(150)).toContain("150 kW");
      expect(formatSnaga(150)).toContain("204 KS");
    });

    it("should handle zero power", () => {
      expect(formatSnaga(0)).toBe("0 kW (0 KS)");
    });
  });

  describe("getGorivoLabel", () => {
    it("should return correct Croatian fuel labels", () => {
      expect(getGorivoLabel("benzin")).toBe("Benzin");
      expect(getGorivoLabel("dizel")).toBe("Dizel");
      expect(getGorivoLabel("hibrid")).toBe("Hibrid");
      expect(getGorivoLabel("elektricni")).toBe("Električni");
    });

    it("should handle unknown fuel types", () => {
      expect(getGorivoLabel("unknown")).toBe("unknown");
    });
  });

  describe("getMjenjacLabel", () => {
    it("should return correct Croatian transmission labels", () => {
      expect(getMjenjacLabel("rucni")).toBe("Ručni");
      expect(getMjenjacLabel("automatski")).toBe("Automatski");
    });

    it("should handle unknown transmission types", () => {
      expect(getMjenjacLabel("unknown")).toBe("unknown");
    });
  });

  describe("filterVozila", () => {
    const mockVozila: Vozilo[] = [
      {
        id: "1",
        marka: "BMW",
        model: "X5",
        godina: 2020,
        cijena: 45000,
        kilometraza: 50000,
        gorivo: "dizel",
        mjenjac: "automatski",
        snaga: 210,
        boja: "Crna",
        opis: "Test",
        slike: [],
        istaknuto: false,
        datumObjave: "2024-01-01",
        karakteristike: [],
      },
      {
        id: "2",
        marka: "Audi",
        model: "A4",
        godina: 2018,
        cijena: 25000,
        kilometraza: 80000,
        gorivo: "benzin",
        mjenjac: "rucni",
        snaga: 140,
        boja: "Bijela",
        opis: "Test",
        slike: [],
        istaknuto: false,
        datumObjave: "2024-01-02",
        karakteristike: [],
      },
    ];

    it("should filter by marka", () => {
      const filters: FilterOptions = { marka: "BMW" };
      const result = filterVozila(mockVozila, filters);
      expect(result).toHaveLength(1);
      expect(result[0].marka).toBe("BMW");
    });

    it("should filter by price range", () => {
      const filters: FilterOptions = { cijenaOd: 20000, cijenaDo: 30000 };
      const result = filterVozila(mockVozila, filters);
      expect(result).toHaveLength(1);
      expect(result[0].marka).toBe("Audi");
    });

    it("should filter by year range", () => {
      const filters: FilterOptions = { godinaOd: 2019, godinaDo: 2021 };
      const result = filterVozila(mockVozila, filters);
      expect(result).toHaveLength(1);
      expect(result[0].godina).toBe(2020);
    });

    it("should filter by gorivo array", () => {
      const filters: FilterOptions = { gorivo: ["benzin"] };
      const result = filterVozila(mockVozila, filters);
      expect(result).toHaveLength(1);
      expect(result[0].gorivo).toBe("benzin");
    });

    it("should filter by kilometraza max", () => {
      const filters: FilterOptions = { kilometrazaDo: 60000 };
      const result = filterVozila(mockVozila, filters);
      expect(result).toHaveLength(1);
      expect(result[0].kilometraza).toBe(50000);
    });

    it("should return empty array when no matches", () => {
      const filters: FilterOptions = { marka: "Tesla" };
      const result = filterVozila(mockVozila, filters);
      expect(result).toHaveLength(0);
    });

    it("should apply multiple filters", () => {
      const filters: FilterOptions = {
        marka: "BMW",
        godinaOd: 2019,
        gorivo: ["dizel"],
      };
      const result = filterVozila(mockVozila, filters);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("1");
    });
  });

  describe("getSortedVozila", () => {
    const mockVozila: Vozilo[] = [
      {
        id: "1",
        marka: "BMW",
        model: "X5",
        godina: 2020,
        cijena: 45000,
        kilometraza: 50000,
        gorivo: "dizel",
        mjenjac: "automatski",
        snaga: 210,
        boja: "Crna",
        opis: "Test",
        slike: [],
        istaknuto: false,
        datumObjave: "2024-01-01",
        karakteristike: [],
      },
      {
        id: "2",
        marka: "Audi",
        model: "A4",
        godina: 2018,
        cijena: 25000,
        kilometraza: 80000,
        gorivo: "benzin",
        mjenjac: "rucni",
        snaga: 140,
        boja: "Bijela",
        opis: "Test",
        slike: [],
        istaknuto: false,
        datumObjave: "2024-01-02",
        karakteristike: [],
      },
    ];

    it("should sort by price ascending", () => {
      const result = getSortedVozila(mockVozila, "cijena-asc");
      expect(result[0].cijena).toBe(25000);
      expect(result[1].cijena).toBe(45000);
    });

    it("should sort by price descending", () => {
      const result = getSortedVozila(mockVozila, "cijena-desc");
      expect(result[0].cijena).toBe(45000);
      expect(result[1].cijena).toBe(25000);
    });

    it("should sort by year ascending", () => {
      const result = getSortedVozila(mockVozila, "godina-asc");
      expect(result[0].godina).toBe(2018);
      expect(result[1].godina).toBe(2020);
    });

    it("should sort by year descending", () => {
      const result = getSortedVozila(mockVozila, "godina-desc");
      expect(result[0].godina).toBe(2020);
      expect(result[1].godina).toBe(2018);
    });

    it("should sort by mileage ascending", () => {
      const result = getSortedVozila(mockVozila, "kilometraza-asc");
      expect(result[0].kilometraza).toBe(50000);
      expect(result[1].kilometraza).toBe(80000);
    });

    it("should not modify original array", () => {
      const original = [...mockVozila];
      getSortedVozila(mockVozila, "cijena-asc");
      expect(mockVozila).toEqual(original);
    });
  });
});

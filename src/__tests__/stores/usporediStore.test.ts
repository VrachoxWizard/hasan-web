import { describe, it, expect, beforeEach } from "vitest";
import { useUsporediStore } from "@/stores/usporediStore";
import { Vozilo } from "@/types/vozilo";

describe("useUsporediStore", () => {
  const mockVozilo: Vozilo = {
    id: "test-1",
    marka: "BMW",
    model: "X5",
    godina: 2020,
    cijena: 45000,
    kilometraza: 50000,
    gorivo: "dizel",
    mjenjac: "automatski",
    snaga: 210,
    boja: "Crna",
    opis: "Test vozilo",
    slike: ["test.jpg"],
    istaknuto: false,
    datumObjave: "2024-01-01",
    karakteristike: ["Test"],
  };

  const mockVozilo2: Vozilo = {
    ...mockVozilo,
    id: "test-2",
    marka: "Audi",
    model: "A4",
  };

  const mockVozilo3: Vozilo = {
    ...mockVozilo,
    id: "test-3",
    marka: "Mercedes",
    model: "C-Class",
  };

  const mockVozilo4: Vozilo = {
    ...mockVozilo,
    id: "test-4",
    marka: "Volkswagen",
    model: "Golf",
  };

  beforeEach(() => {
    // Clear store before each test
    useUsporediStore.getState().clearAll();
  });

  describe("addVozilo", () => {
    it("should add vehicle to comparison list", () => {
      const store = useUsporediStore.getState();
      const success = store.addVozilo(mockVozilo);

      expect(success).toBe(true);
      expect(useUsporediStore.getState().vozila).toHaveLength(1);
      expect(useUsporediStore.getState().vozila[0].id).toBe("test-1");
    });

    it("should not add duplicate vehicle", () => {
      const store = useUsporediStore.getState();

      store.addVozilo(mockVozilo);
      const success = store.addVozilo(mockVozilo);

      expect(success).toBe(false);
      expect(useUsporediStore.getState().vozila).toHaveLength(1);
    });

    it("should not add more than 3 vehicles", () => {
      const store = useUsporediStore.getState();

      store.addVozilo(mockVozilo);
      store.addVozilo(mockVozilo2);
      store.addVozilo(mockVozilo3);
      const success = store.addVozilo(mockVozilo4);

      expect(success).toBe(false);
      expect(useUsporediStore.getState().vozila).toHaveLength(3);
    });

    it("should add up to 3 vehicles successfully", () => {
      const store = useUsporediStore.getState();

      const success1 = store.addVozilo(mockVozilo);
      const success2 = store.addVozilo(mockVozilo2);
      const success3 = store.addVozilo(mockVozilo3);

      expect(success1).toBe(true);
      expect(success2).toBe(true);
      expect(success3).toBe(true);
      expect(useUsporediStore.getState().vozila).toHaveLength(3);
    });
  });

  describe("removeVozilo", () => {
    it("should remove vehicle from comparison list", () => {
      const store = useUsporediStore.getState();

      store.addVozilo(mockVozilo);
      store.addVozilo(mockVozilo2);

      store.removeVozilo("test-1");

      const state = useUsporediStore.getState();
      expect(state.vozila).toHaveLength(1);
      expect(state.vozila[0].id).toBe("test-2");
    });

    it("should do nothing when removing non-existent vehicle", () => {
      const store = useUsporediStore.getState();

      store.addVozilo(mockVozilo);
      store.removeVozilo("non-existent");

      expect(useUsporediStore.getState().vozila).toHaveLength(1);
    });
  });

  describe("clearAll", () => {
    it("should clear all vehicles from comparison list", () => {
      const { addVozilo, clearAll, vozila } = useUsporediStore.getState();

      addVozilo(mockVozilo);
      addVozilo(mockVozilo2);
      addVozilo(mockVozilo3);

      clearAll();

      expect(vozila).toHaveLength(0);
    });

    it("should work on empty list", () => {
      const { clearAll, vozila } = useUsporediStore.getState();

      clearAll();

      expect(vozila).toHaveLength(0);
    });
  });

  describe("isInList", () => {
    it("should return true for vehicle in list", () => {
      const { addVozilo, isInList } = useUsporediStore.getState();

      addVozilo(mockVozilo);

      expect(isInList("test-1")).toBe(true);
    });

    it("should return false for vehicle not in list", () => {
      const { isInList } = useUsporediStore.getState();

      expect(isInList("test-1")).toBe(false);
    });

    it("should return false after vehicle is removed", () => {
      const { addVozilo, removeVozilo, isInList } = useUsporediStore.getState();

      addVozilo(mockVozilo);
      removeVozilo("test-1");

      expect(isInList("test-1")).toBe(false);
    });
  });
});

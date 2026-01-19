import { Vozilo, FilterOptions } from "@/types/vozilo";
import vozilaData from "@/data/vozila.json";
import { validateVozila } from "@/lib/schemas";

let validatedVozila: Vozilo[] | null = null;

export function getVozila(): Vozilo[] {
  // Validate vozila data on first load
  if (validatedVozila === null) {
    const { valid, errors } = validateVozila(vozilaData.vozila);

    if (errors.length > 0) {
      console.warn(
        `⚠️ Found ${errors.length} invalid vehicle entries in vozila.json:`
      );
      errors.forEach(({ index, error }) => {
        console.warn(`  Vehicle at index ${index}: ${error}`);
      });
    }

    validatedVozila = valid as Vozilo[];
    if (process.env.NODE_ENV === "development") {
      console.log(`✅ Loaded ${validatedVozila.length} valid vehicles`);
    }
  }

  return validatedVozila;
}

export function getVoziloById(id: string): Vozilo | undefined {
  return getVozila().find((v) => v.id === id);
}

export function getIstaknutaVozila(): Vozilo[] {
  return getVozila().filter((v) => v.istaknuto);
}

export function getEkskluzivnaVozila(): Vozilo[] {
  return getVozila().filter((v) => v.ekskluzivno);
}

export function filterVozila(
  vozila: Vozilo[],
  filters: FilterOptions
): Vozilo[] {
  return vozila.filter((vozilo) => {
    // Free-text search across multiple fields
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const searchableText = `${vozilo.marka} ${vozilo.model} ${vozilo.opis} ${
        vozilo.boja
      } ${vozilo.karakteristike.join(" ")}`.toLowerCase();
      if (!searchableText.includes(searchLower)) return false;
    }
    if (filters.marka && vozilo.marka !== filters.marka) return false;
    if (
      filters.model &&
      !vozilo.model.toLowerCase().includes(filters.model.toLowerCase())
    )
      return false;
    if (filters.ekskluzivno && !vozilo.ekskluzivno) return false;
    if (filters.godinaOd && vozilo.godina < filters.godinaOd) return false;
    if (filters.godinaDo && vozilo.godina > filters.godinaDo) return false;
    if (filters.cijenaOd && vozilo.cijena < filters.cijenaOd) return false;
    if (filters.cijenaDo && vozilo.cijena > filters.cijenaDo) return false;
    if (
      filters.gorivo &&
      filters.gorivo.length > 0 &&
      !filters.gorivo.includes(vozilo.gorivo)
    )
      return false;
    if (filters.kilometrazaDo && vozilo.kilometraza > filters.kilometrazaDo)
      return false;
    if (filters.mjenjac && vozilo.mjenjac !== filters.mjenjac) return false;
    return true;
  });
}

export function getSortedVozila(vozila: Vozilo[], sortBy: string): Vozilo[] {
  const sorted = [...vozila];
  switch (sortBy) {
    case "cijena-asc":
      return sorted.sort((a, b) => a.cijena - b.cijena);
    case "cijena-desc":
      return sorted.sort((a, b) => b.cijena - a.cijena);
    case "godina-desc":
      return sorted.sort((a, b) => b.godina - a.godina);
    case "godina-asc":
      return sorted.sort((a, b) => a.godina - b.godina);
    case "kilometraza-asc":
      return sorted.sort((a, b) => a.kilometraza - b.kilometraza);
    case "kilometraza-desc":
      return sorted.sort((a, b) => b.kilometraza - a.kilometraza);
    case "datum":
      return sorted.sort(
        (a, b) =>
          new Date(b.datumObjave).getTime() - new Date(a.datumObjave).getTime()
      );
    default:
      return sorted;
  }
}

export function getSimilarVozila(vozilo: Vozilo, limit = 4): Vozilo[] {
  const allVozila = getVozila();
  return allVozila
    .filter((v) => v.id !== vozilo.id)
    .filter(
      (v) =>
        v.marka === vozilo.marka || Math.abs(v.cijena - vozilo.cijena) < 10000
    )
    .slice(0, limit);
}

export function formatCijena(cijena: number): string {
  return new Intl.NumberFormat("hr-HR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cijena);
}

export function formatKilometraza(km: number): string {
  return new Intl.NumberFormat("hr-HR").format(km) + " km";
}

export function formatSnaga(kw: number): string {
  const ks = Math.round(kw * 1.36);
  return `${kw} kW (${ks} KS)`;
}

export function getGorivoLabel(gorivo: string): string {
  const labels: Record<string, string> = {
    benzin: "Benzin",
    dizel: "Dizel",
    hibrid: "Hibrid",
    elektricni: "Električni",
  };
  return labels[gorivo] || gorivo;
}

export function getMjenjacLabel(mjenjac: string): string {
  const labels: Record<string, string> = {
    rucni: "Ručni",
    automatski: "Automatski",
  };
  return labels[mjenjac] || mjenjac;
}

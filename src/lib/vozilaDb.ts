import "server-only";

import type { Vozilo } from "@/types/vozilo";
import { prisma } from "@/lib/prisma";
import vozilaJson from "@/data/vozila.json";

const allowedGorivo = ["benzin", "dizel", "hibrid", "elektricni"] as const;
const allowedMjenjac = ["rucni", "automatski"] as const;

function toGorivo(value: unknown): Vozilo["gorivo"] {
  return (allowedGorivo as readonly string[]).includes(String(value))
    ? (String(value) as Vozilo["gorivo"])
    : "benzin";
}

function toMjenjac(value: unknown): Vozilo["mjenjac"] {
  return (allowedMjenjac as readonly string[]).includes(String(value))
    ? (String(value) as Vozilo["mjenjac"])
    : "rucni";
}

function normalizeVozilo(v: any): Vozilo {
  const year = Number(v.godina ?? 0);
  const datumObjave =
    v.datumObjave ?? (Number.isFinite(year) && year > 0 ? `${year}-01-01` : "");

  return {
    id: String(v.id),
    marka: String(v.marka ?? ""),
    model: String(v.model ?? ""),
    godina: year,
    cijena: Number(v.cijena ?? 0),
    staracijena:
      v.staracijena === null || v.staracijena === undefined
        ? undefined
        : Number(v.staracijena),
    kilometraza: Number(v.kilometraza ?? 0),
    gorivo: toGorivo(v.gorivo),
    mjenjac: toMjenjac(v.mjenjac),
    snaga: Number(v.snaga ?? 0),
    boja: String(v.boja ?? ""),
    opis: String(v.opis ?? ""),
    slike: Array.isArray(v.slike) ? v.slike.map(String) : [],
    istaknuto: !!v.istaknuto,
    ekskluzivno:
      v.ekskluzivno === null || v.ekskluzivno === undefined
        ? undefined
        : !!v.ekskluzivno,
    datumObjave: String(datumObjave),
    karakteristike: Array.isArray(v.karakteristike)
      ? v.karakteristike.map(String)
      : [],
  };
}

function getJsonFallbackVozila(): Vozilo[] {
  const list = (vozilaJson as any)?.vozila;
  if (!Array.isArray(list)) return [];
  return list.map(normalizeVozilo);
}

function mapVehicle(v: any): Vozilo {
  return {
    id: v.id,
    marka: v.marka,
    model: v.model,
    godina: v.godina,
    cijena: v.cijena,
    staracijena: v.staracijena ?? undefined,
    kilometraza: v.kilometraza,
    gorivo: v.gorivo,
    mjenjac: v.mjenjac,
    snaga: v.snaga,
    boja: v.boja,
    opis: v.opis ?? "",
    slike: (v.images ?? []).map((img: any) => img.url),
    istaknuto: !!v.istaknuto,
    ekskluzivno: v.ekskluzivno ?? undefined,
    datumObjave: (v.datumObjave instanceof Date
      ? v.datumObjave.toISOString()
      : v.datumObjave) as string,
    karakteristike: Array.isArray(v.karakteristike)
      ? v.karakteristike
      : (v.karakteristike ?? []),
  };
}

export async function getVozilaDb(): Promise<Vozilo[]> {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: { images: { orderBy: { order: "asc" } } },
      orderBy: [{ datumObjave: "desc" }],
    });
    return vehicles.map(mapVehicle);
  } catch {
    return getJsonFallbackVozila();
  }
}

export async function getVoziloByIdDb(id: string): Promise<Vozilo | null> {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: { images: { orderBy: { order: "asc" } } },
    });
    return vehicle ? mapVehicle(vehicle) : null;
  } catch {
    return getJsonFallbackVozila().find((v) => v.id === id) ?? null;
  }
}

export async function getEkskluzivnaVozilaDb(
  limit?: number
): Promise<Vozilo[]> {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { ekskluzivno: true },
      include: { images: { orderBy: { order: "asc" } } },
      orderBy: [{ ekskluzivnoOrder: "asc" }, { datumObjave: "desc" }],
      take: limit,
    });
    return vehicles.map(mapVehicle);
  } catch {
    const all = getJsonFallbackVozila().filter((v) => v.ekskluzivno);
    return typeof limit === "number" ? all.slice(0, limit) : all;
  }
}

export async function getVozilaByIdsDb(ids: string[]): Promise<Vozilo[]> {
  if (ids.length === 0) return [];
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { id: { in: ids } },
      include: { images: { orderBy: { order: "asc" } } },
    });

    const map = new Map(vehicles.map((v: any) => [v.id, mapVehicle(v)]));
    return ids.map((id) => map.get(id)).filter(Boolean) as Vozilo[];
  } catch {
    const all = getJsonFallbackVozila();
    const map = new Map(all.map((v) => [v.id, v]));
    return ids.map((id) => map.get(id)).filter(Boolean) as Vozilo[];
  }
}

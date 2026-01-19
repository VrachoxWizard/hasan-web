import "server-only";

import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import type { VehicleUpsertInput } from "@/lib/cmsVehicleSchema";
import { slugify } from "@/lib/slugify";

function generateVehicleId(marka: string, model: string, godina: number) {
  const rand = crypto.randomBytes(3).toString("hex");
  const base = slugify(`${marka}-${model}-${godina}-${rand}`);
  return base || crypto.randomUUID();
}

async function getNextExclusiveOrder(): Promise<number> {
  const max = await prisma.vehicle.aggregate({
    where: { ekskluzivno: true, ekskluzivnoOrder: { not: null } },
    _max: { ekskluzivnoOrder: true },
  });
  return (max._max.ekskluzivnoOrder ?? -1) + 1;
}

export async function listVehicles() {
  const vehicles = await prisma.vehicle.findMany({
    include: { images: { orderBy: { order: "asc" } } },
    orderBy: [{ datumObjave: "desc" }],
  });

  const ekskluzivna = vehicles
    .filter((v) => v.ekskluzivno)
    .sort((a, b) => (a.ekskluzivnoOrder ?? 0) - (b.ekskluzivnoOrder ?? 0));

  const ostala = vehicles.filter((v) => !v.ekskluzivno);

  return { vehicles, ekskluzivna, ostala };
}

export async function getVehicle(id: string) {
  return prisma.vehicle.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });
}

export async function upsertVehicle(input: VehicleUpsertInput) {
  const id =
    input.id || generateVehicleId(input.marka, input.model, input.godina);

  const ekskluzivnoOrder = input.ekskluzivno
    ? await getNextExclusiveOrder()
    : null;

  const created = await prisma.vehicle.upsert({
    where: { id },
    create: {
      id,
      naziv: input.naziv,
      marka: input.marka,
      model: input.model,
      godina: input.godina,
      cijena: input.cijena,
      staracijena: input.staracijena ?? null,
      kilometraza: input.kilometraza,
      gorivo: input.gorivo,
      mjenjac: input.mjenjac,
      snaga: input.snaga,
      boja: input.boja,
      opis: input.opis,
      karakteristike: input.karakteristike,
      istaknuto: input.istaknuto,
      ekskluzivno: input.ekskluzivno,
      ekskluzivnoOrder,
      images: {
        create: input.slike.map((img, index) => ({
          url: img.url,
          alt: img.alt,
          order: index,
        })),
      },
    },
    update: {
      naziv: input.naziv,
      marka: input.marka,
      model: input.model,
      godina: input.godina,
      cijena: input.cijena,
      staracijena: input.staracijena ?? null,
      kilometraza: input.kilometraza,
      gorivo: input.gorivo,
      mjenjac: input.mjenjac,
      snaga: input.snaga,
      boja: input.boja,
      opis: input.opis,
      karakteristike: input.karakteristike,
      istaknuto: input.istaknuto,
      ekskluzivno: input.ekskluzivno,
      ekskluzivnoOrder: input.ekskluzivno ? undefined : null,
      images: {
        deleteMany: {},
        create: input.slike.map((img, index) => ({
          url: img.url,
          alt: img.alt,
          order: index,
        })),
      },
    },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (input.ekskluzivno && created.ekskluzivnoOrder == null) {
    const order = await getNextExclusiveOrder();
    return prisma.vehicle.update({
      where: { id },
      data: { ekskluzivnoOrder: order },
      include: { images: { orderBy: { order: "asc" } } },
    });
  }

  return created;
}

export async function setExclusiveOrder(exclusiveIdsInOrder: string[]) {
  await prisma.$transaction(
    exclusiveIdsInOrder.map((id, index) =>
      prisma.vehicle.update({
        where: { id },
        data: { ekskluzivno: true, ekskluzivnoOrder: index },
      })
    )
  );

  await prisma.vehicle.updateMany({
    where: { id: { notIn: exclusiveIdsInOrder }, ekskluzivno: true },
    data: { ekskluzivnoOrder: null },
  });
}

export async function setVehicleExclusive(id: string, exclusive: boolean) {
  if (!exclusive) {
    await prisma.vehicle.update({
      where: { id },
      data: { ekskluzivno: false, ekskluzivnoOrder: null },
    });
    return;
  }

  const order = await getNextExclusiveOrder();
  await prisma.vehicle.update({
    where: { id },
    data: { ekskluzivno: true, ekskluzivnoOrder: order },
  });
}

export async function deleteVehicle(id: string) {
  await prisma.vehicle.delete({ where: { id } });
}

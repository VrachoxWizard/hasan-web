/* eslint-disable no-console */

const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.join(__dirname, "..", "src", "data", "vozila.json");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const vozilaData = require(dataPath);

  const vozila = vozilaData?.vozila ?? [];
  console.log(`Importing ${vozila.length} vehicles from ${dataPath}`);

  let createdOrUpdated = 0;

  for (const v of vozila) {
    await prisma.vehicle.upsert({
      where: { id: v.id },
      create: {
        id: v.id,
        naziv: `${v.marka} ${v.model}`,
        marka: v.marka,
        model: v.model,
        godina: v.godina,
        cijena: v.cijena,
        staracijena: v.staracijena ?? null,
        kilometraza: v.kilometraza,
        gorivo: v.gorivo,
        mjenjac: v.mjenjac,
        snaga: v.snaga,
        boja: v.boja,
        opis: v.opis ?? "",
        karakteristike: v.karakteristike ?? [],
        istaknuto: !!v.istaknuto,
        ekskluzivno: !!v.ekskluzivno,
        ekskluzivnoOrder: null,
        datumObjave: v.datumObjave ? new Date(v.datumObjave) : new Date(),
        images: {
          create: (v.slike ?? []).map((url, index) => ({ url, order: index })),
        },
      },
      update: {
        naziv: `${v.marka} ${v.model}`,
        marka: v.marka,
        model: v.model,
        godina: v.godina,
        cijena: v.cijena,
        staracijena: v.staracijena ?? null,
        kilometraza: v.kilometraza,
        gorivo: v.gorivo,
        mjenjac: v.mjenjac,
        snaga: v.snaga,
        boja: v.boja,
        opis: v.opis ?? "",
        karakteristike: v.karakteristike ?? [],
        istaknuto: !!v.istaknuto,
        ekskluzivno: !!v.ekskluzivno,
        images: {
          deleteMany: {},
          create: (v.slike ?? []).map((url, index) => ({ url, order: index })),
        },
      },
    });

    createdOrUpdated += 1;
  }

  // Assign exclusive ordering (most recent first) for items marked ekskluzivno
  const exclusive = await prisma.vehicle.findMany({
    where: { ekskluzivno: true },
    orderBy: [{ datumObjave: "desc" }],
  });

  await prisma.$transaction(
    exclusive.map((v, index) =>
      prisma.vehicle.update({
        where: { id: v.id },
        data: { ekskluzivnoOrder: index },
      })
    )
  );

  console.log(`Done. Upserted ${createdOrUpdated} vehicles.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

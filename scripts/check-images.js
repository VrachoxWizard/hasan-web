const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const vehicle = await prisma.vehicle.findFirst({
    include: { images: true },
  });

  console.log("Vehicle:", vehicle?.id);
  console.log("Images count:", vehicle?.images?.length);
  console.log("Images:", JSON.stringify(vehicle?.images, null, 2));
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());

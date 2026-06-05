import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const equipment = await prisma.equipment.findMany();

  const orders = await prisma.order.findMany({
    include: {
      items: true,
    },
  });

  console.log(
    JSON.stringify(
      {
        equipment,
        orders,
      },
      null,
      2
    )
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
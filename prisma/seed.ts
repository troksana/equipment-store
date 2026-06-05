import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data (important to avoid duplicates)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.equipment.deleteMany();

  // =========================
  // EQUIPMENT
  // =========================
  const equipment = await Promise.all([
    prisma.equipment.create({
      data: {
        name: "Desktop XQUANTUM XQR5R16S512GB",
        price: 7000,
      },
    }),
    prisma.equipment.create({
      data: {
        name: "Laptop HP Pavilon 16-AG0019NW",
        price: 3500,
      },
    }),
    prisma.equipment.create({
      data: {
        name: "Laptop Maxcom mBook 14 Lite Plus",
        price: 1500,
      },
    }),
    prisma.equipment.create({
      data: {
        name: "Keyboard Tracer Bartix II RF Nano",
        price: 70,
      },
    }),
    prisma.equipment.create({
      data: {
        name: "Mouse Tracer Cozy RF",
        price: 60,
      },
    }),
    prisma.equipment.create({
      data: {
        name: "Printer Epson EcoTank L5310",
        price: 1500,
      },
    }),
  ]);

  const [
    desktop,
    laptopHp,
    laptopMaxcom,
    keyboard,
    mouse,
    printer,
  ] = equipment;

  // =========================
  // ORDER 1 - APPROVED
  // =========================
  await prisma.order.create({
    data: {
      employeeName: "John Simons",
      department: "sales department",
      justification: "Equipment for business trips and remote work",
      priority: "MEDIUM",
      status: "APPROVED",
      items: {
        create: [
          {
            equipmentId: laptopHp.id,
            quantity: 1,
            unitPrice: laptopHp.price,
          },
          {
            equipmentId: keyboard.id,
            quantity: 1,
            unitPrice: keyboard.price,
          },
          {
            equipmentId: mouse.id,
            quantity: 1,
            unitPrice: mouse.price,
          },
        ],
      },
    },
  });

  // =========================
  // ORDER 2 - CANCELLED
  // =========================
  await prisma.order.create({
    data: {
      employeeName: "Ann Cusack",
      department: "administrative department",
      justification: "Replacement of equipment due to a small screen",
      priority: "LOW",
      status: "CANCELLED",
      items: {
        create: [
          {
            equipmentId: laptopMaxcom.id,
            quantity: 1,
            unitPrice: laptopMaxcom.price,
          },
        ],
      },
    },
  });

  // =========================
  // ORDER 3 - DRAFT
  // =========================
  await prisma.order.create({
    data: {
      employeeName: "Henry Wasosa",
      department: "Management",
      justification: "New employee equipment",
      priority: "HIGH",
      status: "DRAFT",
      items: {
        create: [
          {
            equipmentId: desktop.id,
            quantity: 1,
            unitPrice: desktop.price,
          },
          {
            equipmentId: keyboard.id,
            quantity: 1,
            unitPrice: keyboard.price,
          },
          {
            equipmentId: mouse.id,
            quantity: 1,
            unitPrice: mouse.price,
          },
        ],
      },
    },
  });

  console.log("✅ Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
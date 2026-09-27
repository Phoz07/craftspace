import { PrismaClient } from "@prisma/client";
import { INITIAL_SEED_LEADS } from "../src/lib/db";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding CraftSpace leads to database...");

  for (const lead of INITIAL_SEED_LEADS) {
    await prisma.lead.upsert({
      where: { refCode: lead.refCode },
      update: {},
      create: {
        id: lead.id,
        refCode: lead.refCode,
        customerName: lead.customerName,
        phoneNumber: lead.phoneNumber,
        lineId: lead.lineId,
        propertyType: lead.propertyType,
        areaSqm: lead.areaSqm,
        selectedZones: lead.selectedZones,
        materialGrade: lead.materialGrade,
        estimatedMin: lead.estimatedMin,
        estimatedMax: lead.estimatedMax,
        status: lead.status,
        notes: lead.notes,
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt,
      },
    });
  }

  console.log(`Successfully seeded ${INITIAL_SEED_LEADS.length} leads!`);
}

main()
  .catch((e) => {
    console.error("Error during database seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/**
 * One-time migration: copy address from details.address (JSON) to address column.
 * Usage: npx tsx scripts/migrateAddressFromDetails.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const providers = await prisma.provider.findMany({
    select: { id: true, address: true, details: true },
  });

  let migrated = 0;
  for (const p of providers) {
    if (p.address) continue;

    const details = p.details;
    if (details && typeof details === "object" && !Array.isArray(details)) {
      const addr = (details as { address?: string }).address;
      if (typeof addr === "string" && addr.trim()) {
        await prisma.provider.update({
          where: { id: p.id },
          data: { address: addr.trim() },
        });
        migrated++;
      }
    }
  }

  console.log(`Migrated ${migrated} providers from details.address to address column.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

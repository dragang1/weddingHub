/**
 * One-off: set coverImageUrl, coverImageSource, coverImageAttribution to null
 * for providers that have source="placeholder", so fillCoverImages can re-run
 * and try OG → Places → placeholder again.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const r = await prisma.provider.updateMany({
    where: { coverImageSource: "placeholder" },
    data: {
      coverImageUrl: null,
      coverImageSource: null,
      coverImageAttribution: null,
    },
  });
  console.log("Reset", r.count, "providers with placeholder cover. Run: npm run fill-cover-images");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

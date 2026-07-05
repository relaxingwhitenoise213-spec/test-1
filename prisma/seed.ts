/**
 * Database seed script.
 *
 * Run with `npx tsx prisma/seed.ts` after configuring DATABASE_URL and running
 * `npx prisma migrate dev`. Creates a demo admin user with a sample generation.
 *
 * Requires: npm install -D prisma tsx && npm install @prisma/client
 */
import { PrismaClient, Role, ProviderKey, PlanTier } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@vocalis.app" },
    update: {},
    create: {
      email: "admin@vocalis.app",
      name: "Vocalis Admin",
      role: Role.ADMIN,
      emailVerified: new Date(),
      settings: {
        create: { theme: "system", locale: "en", defaultProvider: ProviderKey.WEB_SPEECH },
      },
      subscription: {
        create: { tier: PlanTier.ENTERPRISE },
      },
    },
  });

  await prisma.generation.create({
    data: {
      userId: admin.id,
      title: "Welcome to Vocalis",
      text: "Welcome to Vocalis, your modern text-to-speech studio.",
      provider: ProviderKey.WEB_SPEECH,
      voiceId: "default",
      voiceName: "System Default",
      language: "en-US",
      characters: 54,
      durationSeconds: 4,
      settings: { rate: 1, pitch: 1, volume: 1 },
    },
  });

  console.log(`Seeded admin user: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

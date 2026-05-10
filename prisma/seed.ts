import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const existing = await prisma.project.findFirst({
    where: { title: "Personal Engineering Portfolio" },
  });

  if (!existing) {
    await prisma.project.create({
      data: {
        title: "Personal Engineering Portfolio",
        status: "published",
      },
    });
    console.log("Seeded: Personal Engineering Portfolio");
  } else {
    console.log("Already seeded: Personal Engineering Portfolio");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });

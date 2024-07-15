const { PrismaClient } = require("@prisma/client");
const { hashPassword } = require("../utils/password");
const prisma = new PrismaClient();

async function main() {
  // Creating Hash Password ONE WAY !!!
  const hash = hashPassword("12345678");
  const admin = await prisma.user.upsert({
    where: { email: "admin@system.com" },
    update: {},
    create: {
      name: "Syatem Admin",
      email: "admin@system.com",
      role: "ADMIN",
      phone: "01012345678",
      password: hash,
      username: "system@admin",
    },
  });

  console.log({ admin });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

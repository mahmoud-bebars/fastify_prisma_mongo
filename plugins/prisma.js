const fp = require("fastify-plugin");
const { PrismaClient } = require("@prisma/client");

module.exports = fp(async function (fastify, opts) {
  const prisma = new PrismaClient();

  await prisma.$connect();

  fastify.decorate("prisma", prisma);
  fastify.addHook("onClose", async (server) => {
    await server.prisma.$disconnect();
  });
});

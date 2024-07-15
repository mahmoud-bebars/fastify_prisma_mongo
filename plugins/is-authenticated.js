require("dotenv").config();

const fp = require("fastify-plugin");

const JWT_SECRET = process.env.JWT_SECRET;

// ? Authetication Is Done Through JWT & siome Extra Manual Funcrtion for Security & accuracy Purposes

module.exports = fp(async function (fastify, opts) {
  fastify.register(require("@fastify/jwt"), {
    secret: JWT_SECRET,
  });
  // Normal Authorization
  fastify.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
  // Admin Athiorizartion
  fastify.decorate("isAdmin", async function (request, reply) {
    try {
      const { role } = request.user;
      if (role !== "ADMIN") {
        throw new Error("401 Not Authorized to make this action");
      }
    } catch (err) {
      reply.code(401).send(err);
    }
  });
  // Checking On User Activation
  fastify.decorate("isActive", async function (request, reply) {
    try {
      const { user_id } = request.user;
      const { prisma } = request.server;
      const { is_active } = await prisma.user.findUnique({
        where: { id: user_id },
        select: {
          id: true,
          is_active: true,
        },
      });

      if (!is_active) {
        throw new Error("401 Deactivated User");
      }
    } catch (err) {
      reply.code(401).send(err);
    }
  });
});

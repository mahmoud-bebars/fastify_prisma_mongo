const { userActivation } = require("../controllers/users/admin");
const {
  updateProfile,
  updateCountry,
  updateAvatar,
} = require("../controllers/users/index");
const { contentParser } = require("fastify-multer");
const { uploadMedia } = require("../utils/media");

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify, options) {
  /* Register Multer */
  fastify.register(contentParser);

  /* Activation - Admin Action */
  fastify.put(
    "/active/:id",
    { onRequest: [fastify.authenticate, fastify.isAdmin] },
    userActivation,
  );

  /* Profile Update */
  fastify.put(
    "/update",
    { onRequest: [fastify.authenticate, fastify.isActive] },
    updateProfile,
  );

  /* Profile Avavtar */
  fastify.put("/avatar", {
    onRequest: [fastify.authenticate, fastify.isActive],
    preHandler: uploadMedia,
    handler: updateAvatar,
  });
}

module.exports = routes;

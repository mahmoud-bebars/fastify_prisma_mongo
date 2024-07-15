const { verfiy, signIn, signUp } = require("../controllers/auth/authenticate");
const {
  updatePassword,
  requestOTP,
  verfiyOTP,
  resetPassword,
} = require("../controllers/auth/security");
/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify, options) {
  /* Login */
  fastify.post("/login", signIn);

  /* Register */
  fastify.post("/register", signUp);

  /* Verfiy Token */
  fastify.get(
    "/",
    { onRequest: [fastify.authenticate, fastify.isActive] },
    verfiy,
  );

  /* Password Update */
  fastify.put(
    "/password/update",
    { onRequest: [fastify.authenticate, fastify.isActive] },
    updatePassword,
  );

  /* Request OTP */
  fastify.post("/otp/request/:phone", requestOTP);

  /* Verfiy OTP */
  fastify.post("/otp/verfiy/:phone", verfiyOTP);

  /* Password Reset */
  fastify.put("/password/reset", resetPassword);
}

module.exports = routes;

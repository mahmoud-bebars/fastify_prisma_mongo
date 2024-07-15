require("dotenv").config();

const path = require("path");

// CommonJs
const fastify = require("fastify")({
  logger: true,
});

/**
 * Configure CORS
 */
fastify.register(require("@fastify/cors"), {
  origin: "*" /* An Array of Trusted Services Should Be added Here */,
  methods: "*",
  allowedHeaders: ["Content-Type", "Authorization"],
});

/**
 * Configure Rate Limit
 */
fastify.register(require("@fastify/rate-limit"), {
  max: 100,
  timeWindow: "1 minute",
});
/**
 * Configure Helmet
 */

fastify.register(require("@fastify/helmet"), { contentSecurityPolicy: false });

/**
 * Fastify Redis Register
 */
fastify.register(require("@fastify/redis"), {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

/**
 * Enable multipart & form Data content Type in Requests
 */
fastify.register(require("@fastify/multipart"));
fastify.register(require("@fastify/formbody"));

/**
 * Serve Static Assets
 */
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  // prefix: "/public/", // optional: default '/'
});

/**
 * Autoload Plugins
 */
fastify.register(require("@fastify/autoload"), {
  dir: path.join(__dirname, "plugins"),
});

/**
 * Load Routes - From ./route/index (Array style)
 */
const { routes } = require("./routes/index");

routes.forEach(({ routeName, prefix }) => {
  const route = path.join(__dirname, "routes", `${routeName}.js`);

  fastify.register(require(route), { prefix });
});

/**
 * Not Found Route
 */
fastify.setNotFoundHandler(function (request, reply) {
  return reply.code(404).send({
    code: 404,
    error: "404 - NOT FOUND",
    message: "Action Not Found",
  });
});

/**
 * Run the server!
 */
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT, host: process.env.HOST });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();

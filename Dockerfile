# Use a base image with NodeJS 18
FROM node:lts-slim as builder

LABEL version="1.0.0"
LABEL description="Users Auth Service Built with FastifyJS Powered with Node"
LABEL maintainer="Mahmoud Bebars <mahmoud.bebars.me@gmail.com>"

# set default node env
ARG NODE_ENV=development
# ARG NODE_ENV=production
# to be able to run tests (for example in CI), do not set production as environment
ENV NODE_ENV=${NODE_ENV}

ENV NPM_CONFIG_LOGLEVEL=warn
 


# Install all the dependencies in the container using the package.json file
COPY package.json .
COPY .env.example .env

# install dependencies here, for better reuse of layers
RUN npm install && npm audit fix && npm cache clean --force 
 
# copy all sources in the container (exclusions in .dockerignore file)
COPY . .

EXPOSE 5000

ENV PORT 5000

# add an healthcheck, useful
# healthcheck with curl, but not recommended
# HEALTHCHECK CMD curl --fail http://localhost:8000/health || exit 1
# healthcheck by calling the additional script exposed by the plugin
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s CMD npm run healthcheck-manual


# Run the App
CMD HOST="0.0.0.0" npm run docker:start

# end.
# users_micro_service

## Description

a microserivce to be used in microserivce architecture for authorization, authentication & user actions.

## Scripts

```json
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js | pino-pretty",
    "clean:node": "rm -rf ./node_modules",
    "docker:start": "npm run start --host 0.0.0.0 --listen debug-level=debug"
  },

```

## Technolgies

| Name               | Version   | Type        |
| ------------------ | --------- | ----------- |
| @fastify/autoload  | `^5.8.0`  | prduction   |
| @fastify/cors      | `^8.4.0`  | prduction   |
| @fastify/formbody  | `^7.4.0`  | prduction   |
| @fastify/jwt       | `^7.2.2`  | prduction   |
| @fastify/multipart | `^8.0.0`  | prduction   |
| @fastify/redis     | `^6.1.1`  | prduction   |
| @fastify/static    | `^6.11.2` | prduction   |
| crypto             | `^1.0.1`  | prduction   |
| dotenv             | `^16.3.1` | prduction   |
| fastify            | `^4.24.3` | prduction   |
| fastify-multer     | `^2.0.3`  | prduction   |
| moment             | `^2.29.4` | prduction   |
| prisma             | `^5.16.2` | prduction   |
| @prisma/client     | `^5.16.2` | production  |
| sharp              | `^0.33.2` | prduction   |
| socket.io          | `^4.7.4`  | prduction   |
| nodemon            | `3.0.1`   | development |

## Routes

- Every Router has a Controller to Manage the Request Functions

### Activation `"/api/active"`

| Name  | Method | Description                                           |
| ----- | ------ | ----------------------------------------------------- |
| `"/"` | `PUT`  | activation for Users (excluding normal type of users) |

### Authentication `"/api/auth"`

| Name          | Method | Description                                        |
| ------------- | ------ | -------------------------------------------------- |
| `"/login"`    | `POST` | Logging Users (All Types to the System)            |
| `"/register"` | `POST` | Registering Users to the System (Normal type Only) |

### Authorization `"/api/verfiy"`

| Name  | Method | Description                                             |
| ----- | ------ | ------------------------------------------------------- |
| `"/"` | `GET`  | using The authenticate Plugin to authorize users tokens |

### OTP `"/api/otp"`

| Name         | Method | Description                                         |
| ------------ | ------ | --------------------------------------------------- |
| `"/request"` | `POST` | using otp Genrator to genrate & save otp in redis   |
| `"/verfiy"`  | `POST` | Verfiying Incoming OTP from the saved ones in redis |

### OTP `"/api/password"`

| Name        | Method | Description                                                                               |
| ----------- | ------ | ----------------------------------------------------------------------------------------- |
| `"/update"` | `PUT`  | responsible to update Passwords for users                                                 |
| `"/reset"`  | `PUT`  | Lies on the OTP Verfiy which responed with Encrypted ID to be usee here for reset Process |

### Profile `"/api/profile"`

| Name        | Method | Description                        |
| ----------- | ------ | ---------------------------------- |
| `"/update"` | `PUT`  | responsible to update Users Info   |
| `"/avatar"` | `PUT`  | responsible to update Users Avatar |

## Plugins

### Socket - Manual Created

- Using `Socket.io` to Create Socket Connection to Be used with Other Services for Authorization & Passing Info Through it
- Must Have Token To Enter The Socket Through Path ---> `"/socket"`

### is-authenticated - Manual Created

- usage Here to authenticate user Token Throuugh `JWT`
- checking user is Admin ---> Needed in System Updates & Opeartion Actions
- checking is Active to Confirm this user is Active

## Utilites

### Crypto

- using Crypto to Encrypt & Decrypt ---> Most usae in OTP Verfying - Impress me with More Usage

### Media

- Handling Multer Storage & uising Sharp to Convert & Optimize Media to save it in File Sysytem OR we Can send it to media Serveer Like `S3 Bucket` in `AWS`

### OTP

- Handling OTP Genrating with Simple But Powerful Loop -Tested on 10000 otps in minute - unquie code Every time
- shorter or longer the Code as You Wish inside the loop `for (i = 0; i < 6; i++)` it's set to `6`

### Password

- Hashing Passwords using `Crypto` with `SALT`, `HAMC` & `PASS_SECRET`
- comparing the password with Received Hash using same Methods
- Testing The Password with simple `regex` & password length - you can add more as you like here - it's seprated model for you

## Database

- It's simple here we Only Have 3 tables (Models/Migrations)

### User - Timestamp - Excluding Password From `DefaultScope`

| Name        | Type        | deafult value                              | unique |
| ----------- | ----------- | ------------------------------------------ | ------ |
| `id`        | `ObjectID`  | `auto()`                                   | `YES`  |
| `role`      | `enum Role` | `USER` role                                | `YES`  |
| `username`  | `STRING`    | none                                       | `YES`  |
| `name`      | `STRING`    | none                                       | `NO`   |
| `phone`     | `STRING`    | none                                       | `YES`  |
| `email`     | `STRING`    | none                                       | `YES`  |
| `is_active` | `BOOLEAN`   | `true`                                     | `NO`   |
| `avatar`    | `STRING`    | `"/public/assets/avatars/placeholder.png"` | `NO`   |
| `password`  | `STRING`    | none                                       | `NO`   |
| `createdAt` | `DateTime`  | `now()`                                    | `NO`   |
| `updatedAt` | `DateTime`  | `@updatedAt`                               | `NO`   |

## Environment Variables

```shell

# Environment between ["development","test","production"]
NODE_ENV="development"

DATABASE_URL="mongodb://root:12345@localhost:27017/users_testing?authSource=admin&directConnection=true"

# Basic Server Data
HOST="0.0.0.0"
PORT="5000"
REDIS_HOST="redis"
REDIS_PORT="6379"

# Time Zones
APP_TIMEZONE="Africa/Cairo"

# JWT Secret
JWT_SECRET="sercet"

# Password Setup
PASS_SECRET="pass-secret"
SALT=16
HAMC=sha256

# Crypto Setup
ALOGORITHM="aes-256-ctr"
SECRET_KEY="secret-key"

```

## Mongo Replica Docker Container Creation (Must beacuse Prisma Only work In Replica Mode with Mongo)

```bash

 docker run --name mongo-replica \
      -p 27017:27017 \
      -e MONGO_INITDB_ROOT_USERNAME="root" \
      -e MONGO_INITDB_ROOT_PASSWORD="12345" \
      -d prismagraphql/mongo-single-replica:5.0.3

```

## Public Directory

- Temp - needed to handle Incoming Files
- avavtars - Handling Avatars saved

## Contriburtion

- I will Be Happy To Approve Extra Features or Updates In The architecture
- Upcomming Feature that i will be happy to see a suggestions on `OAuth` & `passwordless`

Happy Coding...

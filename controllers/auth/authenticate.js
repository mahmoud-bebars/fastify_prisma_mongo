const moment = require("moment");
const {
  comparePassword,
  testPassword,
  hashPassword,
} = require("../../utils/password");

// Token Verfication
// This is the Most Import Entry in Our Service
// ? We are depending on it to Authorize Users All over the Other Services when it's needed VIA https || RabbitMQ
module.exports.verfiy = async (request, reply) => {
  try {
    const { redis } = request.server;
    const results = request.user;

    // save on redis with expiration for  24 hours
    await redis.setex(
      `session:${results.role.name}:${results.user_id}`,
      60 * 60 * 24,
      JSON.stringify(results),
    );

    return reply.code(200).send({
      code: 200,
      results: results,
    });
  } catch (error) {
    return reply.code(400).send(error);
  }
};

// Register (For Normal Users Only - others account Craetion Will be handled from Users Controller)
module.exports.signUp = async (request, reply) => {
  try {
    const { phone, email, password, name, username } = request.body;
    const { prisma } = request.server;
    // Check is user Exist By Phone/Email

    const existEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    const existPhone = await prisma.user.findUnique({
      where: {
        phone: phone,
      },
    });

    if (existEmail) {
      throw new Error("Email Already Taken...");
    }

    if (existPhone) {
      throw new Error("Phone Already Taken...");
    }

    // using utilty we check on user valitaty
    const checkPassword = testPassword(password);

    if (checkPassword.error) {
      throw new Error(checkPassword.message);
    }

    // Creating Hash Password ONE WAY !!!
    const hash = hashPassword(password);

    await prisma.user.create({
      data: {
        phone: phone,
        email: email,
        password: hash,
        name: name,
        username: username,
      },
    });

    /* 
      ? Any Extra Logic Can Be added Here Specifaclly If it depends on User Creation...
    */

    // We are Sending Code Only
    // Assume  Front Developer is Cool Enough To send Login Request to Authorize The user Automatically using login request via http
    return reply.code(201).send({
      code: 201,
    });
  } catch (error) {
    return reply.code(400).send(error);
  }
};

// Login (Works for All System Users)
module.exports.signIn = async (request, reply) => {
  try {
    const { jwt, prisma } = request.server;
    const { phone, password } = request.body;

    // 1st Fetch User By Phone
    const user = await prisma.user.findUnique({
      where: {
        phone: phone,
      },
    });

    // 2nd Check on Uswer Existance
    if (!user) {
      throw new Error("User does not exist!");
    }
    // 3rd Check on User Active Status
    if (!user.is_active) {
      throw new Error("Account is Deactivated");
    }

    // 4th Check if password correct
    const authenticated = comparePassword(password, user.password);

    if (!authenticated) {
      throw new Error("Incorrect password");
    }
    // 5th Sign access token for user
    const token = jwt.sign({
      user_id: user.id,
      role: user.role,
      name: user.name,
      phone: user.phone,
      email: user.email,
    });

    // 6th create Response Results
    let results = {
      accessToken: `Bearer ${token}`,
      user_id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
      joined_at: moment(user.created_at).format("YYYY-MM-DD hh:mm A"),
    };

    // 8th Send Reply
    return reply.code(200).send({
      code: 200,
      results,
    });
  } catch (error) {
    return reply.code(400).send(error);
  }
};

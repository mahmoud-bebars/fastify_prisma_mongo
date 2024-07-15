const { decrypt, encrypt } = require("../../utils/encryption");
const { generate } = require("../../utils/otp");
const {
  comparePassword,
  testPassword,
  hashPassword,
} = require("../../utils/password");

// Change Password - When User Logged In Situation
module.exports.updatePassword = async (request, reply) => {
  try {
    const { prisma } = request.server;
    const { user_id } = request.user;
    const { new_password, old_password } = request.body;

    // 1st Fetch User By Phone
    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });

    // Double Check for user Existance
    if (!user) {
      throw new Error("User does not exist!");
    }

    // check if password correct
    const authenticated = comparePassword(old_password, user.password);

    // Updating log_limit if the password is not correct
    if (!authenticated) {
      throw new Error("Incorrect password");
    }

    const checkPassword = testPassword(new_password);

    if (checkPassword.error) {
      throw new Error(checkPassword.message);
    }

    // create New Hash Password
    const hash = hashPassword(new_password);

    // Save new hash password
    await prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        password: hash,
      },
    });

    return reply.code(200).send({
      code: 200,
    });
  } catch (error) {
    return reply.code(400).send(error);
  }
};

// Request OTP to Change Password
module.exports.requestOTP = async (request, reply) => {
  try {
    const { redis, prisma } = request.server;
    const { phone } = request.params;
    const user = await prisma.user.findUnique({
      where: {
        phone: phone,
      },
    });

    if (!user) {
      throw new Error("User does not exist!");
    }
    // genrate otp from 6 digiats
    const otp = generate();

    // save on redis with expiration for 600 second --> 10 mintues
    await redis.setex(otp, 600, phone);

    /* 
    ... the Logic where the otp will be sent to user 
    */

    return reply.code(200).send({
      code: 200,
      results: `An 6 digit code has been sent to ${phone} expires in 10 minutes`,
    });
  } catch (error) {
    return reply.code(400).send(error);
  }
};

// Verfiy OTP
module.exports.verfiyOTP = async (request, reply) => {
  try {
    let results = {};

    const { redis, prisma } = request.server;

    const { phone } = request.params;

    const { otp } = request.query;

    const user = await prisma.user.findUnique({
      where: {
        phone: phone,
      },
    });

    if (!user) {
      throw new Error("User does not exist!");
    }

    const saved_otp = await redis.get(otp);

    if (saved_otp) {
      const encryption = encrypt(`${user.id}`);
      results = {
        message: `OTP Verfied Sucessfully`,
        encryption: encryption,
      };
    } else {
      throw new Error("OTP has expired! request another one...");
    }

    return reply.code(200).send({
      code: 200,
      results,
    });
  } catch (error) {
    return reply.code(400).send(error);
  }
};

// Reset Password After OTP Process
module.exports.resetPassword = async (request, reply) => {
  try {
    const { prisma } = request.server;
    const { encryption, new_password } = request.body;

    const user_id = decrypt(encryption);

    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });

    if (!user) {
      throw new Error("User does not exist!");
    }

    const checkPassword = testPassword(new_password);

    if (checkPassword.error) {
      throw new Error(checkPassword.message);
    }

    if (new_password.length < 6) {
      throw new Error("The password must be at least 6 characters.");
    }

    // create New Hash Password
    const hash = hashPassword(new_password);

    // Save new hash password
    await prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        password: hash,
      },
    });

    return reply.code(200).send({
      code: 200,
    });
  } catch (error) {
    return reply.code(400).send(error);
  }
};

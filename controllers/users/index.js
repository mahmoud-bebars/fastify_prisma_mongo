const { processMedia } = require("../../utils/media");

// Dividing Information Updating Makes Debugging Easier

// Update Profile Info
module.exports.updateProfile = async (request, reply) => {
  try {
    const { user_id } = request.user;
    const { first_name, last_name, email } = request.body;

    await prisma.user.update({
      where: { id: user_id },
      data: {
        first_name: first_name,
        last_name: last_name,
        email: email,
      },
    });

    return reply.code(200).send({
      code: 200,
    });
  } catch (error) {
    return reply.code(400).send(error);
  }
};

module.exports.updateAvatar = async (request, reply) => {
  try {
    const { user_id } = request.user;

    const { avatar } = await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        avatar: true,
      },
    });

    const new_avatar_file = request.files[0];

    const placeholder = avatar === "placeholder.png" ? true : false;

    const new_avatar_path = await processMedia(
      "avatars",
      avatar,
      new_avatar_file,
      placeholder,
    );

    if (!new_avatar_path) {
      throw new Error("Could not Update Profile Avatar");
    }

    await prisma.user.update({
      where: { id: user_id },
      data: {
        avatar: new_avatar_path,
      },
    });

    return reply.code(200).send({
      code: 200,
      results: new_avatar_path,
    });
  } catch (error) {
    return reply.code(400).send(error);
  }
};

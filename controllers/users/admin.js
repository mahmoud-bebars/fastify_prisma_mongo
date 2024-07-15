// Update User Activation - Extra Entry to Enable Admin for Account Deactivtion on System Employees
// ? This Action Can Only Be Taken on System Employees Normal User Can not Be Deactivated By The System
module.exports.userActivation = async (request, reply) => {
  try {
    const { id } = request.params;
    const { prisma } = request.server;

    const { is_active } = await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        is_active: true,
      },
    });

    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        is_active: !is_active,
      },
    });

    return reply.code(200).send({
      code: 200,
    });
  } catch (error) {
    return reply.code(400).send(error);
  }
};

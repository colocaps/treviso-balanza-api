// features/auth/controller/user.controller.js
const userService = require('../service/user-service');
const {
  registerSchemma,
  getUserSchemma,
  getUsersSchemma,
} = require('../api/user.api');
const User = require('../model/user');

async function userController(fastify, options) {
  // Ruta para obtener todos los usuarios
  fastify.route({
    url: '/users',
    method: 'GET',
    schema: getUsersSchemma,
    handler: async (request, reply) => {
      try {
        const users = await userService.getAllUsers();
        return users;
      } catch (err) {
        request.log.error(`Error al obtener usuarios`, err);
        throw err;
      }
    },
  });

  fastify.route({
    method: 'GET',
    url: '/user/:id',
    schema: getUserSchemma,
    handler: async (request, reply) => {
      const { id } = request.params;
      const user = await userService.getUserById(id);

      if (!user) {
        return reply.status(404).send({ error: 'Usuario no encontrado' });
      }

      return reply.send(user);
    },
  });

  fastify.route({
    method: 'POST',
    url: '/register',
    schema: registerSchemma,
    handler: async (request, reply) => {
      try {
        const authHeader = request.headers.authorization;
        const idToken = authHeader.split(' ')[1];

        const decoded = await fastify.firebaseAdmin
          .auth()
          .verifyIdToken(idToken);

        const user = await createUserIfNotExists(
          {
            uid: decoded.uid,
            email: decoded.email,
          },
          {
            name: request.body.name,
            lastname: request.body.lastname,
            dni: request.body.dni,
            profile: request.body.profile,
          },
        );

        return reply.code(201).send({ user });
      } catch (err) {
        fastify.log.error(err);
        return reply
          .status(500)
          .send({ error: 'No se pudo registrar el usuario' });
      }
    },
  });
}

module.exports = userController;

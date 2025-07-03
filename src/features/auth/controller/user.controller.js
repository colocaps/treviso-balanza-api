// features/auth/controller/user.controller.js
const userService = require('../service/user-service');
const {
  registerSchemma,
  getUserSchemma,
  getUsersSchemma,
  updateUserSchema,
} = require('../api/user.api');
const buildErrorResponse = require('../../../middlewares/errors/error-handler');

async function userController(fastify, options) {
  // Ruta para obtener todos los usuarios
  fastify.route({
    url: '/users',
    method: 'GET',
    schema: getUsersSchemma,
    handler: async (request, reply) => {
      try {
        const users = await userService.getAllUsers();
        console.log('Usuarios encontrado:', users);
        return users;
      } catch (err) {
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
      try {
        if (!user) {
          const error = new Error('Usuario no encontrado');
          error.statusCode = 404;
          throw error;
        }
        return { user };
      } catch (e) {
        throw e;
      }
    },
  });

  fastify.route({
    method: 'GET',
    url: '/user',
    schema: getUserSchemma,
    handler: async (request, reply) => {
      const authHeader = request.headers.authorization;
      const idToken = authHeader.split(' ')[1];

      const decoded = await fastify.firebaseAdmin.auth().verifyIdToken(idToken);
      console.log('UID del token:', decoded.uid);
      const user = await userService.getUserByUid(decoded.uid);
      console.log('Usuario encontrado:', user);
      if (!user) {
        const error = new Error('Usuario no encontrado');
        error.statusCode = 404;
        throw error;
      }

      return { user };
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

        // Buscar perfil
        const Profile = require('../model/profile');
        let profile;
        if (request.body.profile) {
          profile = await Profile.findOne({ name: request.body.profile });
          if (!profile) {
            return reply.code(400).send({ error: 'Perfil inválido' });
          }
        } else {
          profile = await Profile.findOne({ name: 'operador' });
        }
        // Verificar si usuario ya existe
        const existingUser = await userService.getUserByUid(decoded.uid);
        if (existingUser) {
          return reply.code(409).send({
            warning: 'Usuario ya registrado',
            user: existingUser,
          });
        }
        // Crear usuario
        const user = await userService.createUserIfNotExists(
          {
            uid: decoded.uid,
            email: decoded.email,
          },
          {
            name: request.body.name,
            lastname: request.body.lastname,
            dni: request.body.dni,
            profile: profile._id, // Asignamos el _id del perfil
          },
        );

        return reply.code(201).send({ user });
      } catch (err) {
        throw err;
      }
    },
  });
  fastify.route({
    method: 'PUT',
    url: '/user',
    schema: updateUserSchema,
    handler: async (request, reply) => {
      try {
        const authHeader = request.headers.authorization;
        const idToken = authHeader.split(' ')[1];

        const decoded = await fastify.firebaseAdmin
          .auth()
          .verifyIdToken(idToken);

        const uid = decoded.uid;

        const User = require('../model/user'); // Ajustá la ruta si es distinta
        const Profile = require('../model/profile');

        const user = await User.findOne({ uid });

        if (!user) {
          return reply.code(404).send({ error: 'Usuario no encontrado' });
        }

        // Actualización condicional de campos
        if (request.body.name) user.name = request.body.name;
        if (request.body.lastname) user.lastname = request.body.lastname;
        if (request.body.dni) user.dni = request.body.dni;

        // Cambiar perfil si se especifica
        if (request.body.profile) {
          const profile = await Profile.findOne({ name: request.body.profile });
          if (!profile) {
            return reply.code(400).send({ error: 'Perfil inválido' });
          }
          user.profile = profile._id;
        }

        await user.save();

        // Opcional: devolver el perfil populado
        const updatedUser = await User.findById(user._id).populate('profile');

        return reply.code(200).send({ user: updatedUser });
      } catch (err) {
        request.log.error(err);
        return reply.code(500).send({ error: 'Error actualizando el usuario' });
      }
    },
  });
}

module.exports = userController;

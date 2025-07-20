const fp = require('fastify-plugin');

async function verifyAuthPlugin(fastify, opts) {
  fastify.decorateRequest('user', null);
  fastify.decorateRequest('companyId', null);

  fastify.addHook('onRequest', async (request, reply) => {
    try {
      const url = request.raw.url;

      // Ignorar preflight
      if (request.method === 'OPTIONS') return;

      // Rutas públicas (Swagger, etc.)
      const isPublic =
        url.startsWith('/docs') ||
        url.startsWith('/public') ||
        url.startsWith('/company');
      if (isPublic) return;

      const authHeader = request.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return reply
          .code(401)
          .send({ error: 'Token inválido: faltante o mal formado' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = await fastify.firebaseAdmin.auth().verifyIdToken(token);
      request.user = decoded; // uid, email, etc.

      // Extraer companyId del header
      const companyId = request.headers['x-company-id'];
      if (!companyId) {
        return reply
          .code(400)
          .send({ error: 'Falta el Company ID en el header' });
      }

      request.companyId = companyId;

      // Excepción para el registro
      if (url.startsWith('/register')) {
        return; // Solo se valida el token y se inyecta companyId
      }

      // Validar usuario en MongoDB
      const User = require('../features/auth/model/user');
      const user = await User.findOne({ uid: decoded.uid });
      if (!user) {
        return reply
          .code(404)
          .send({ error: 'Usuario no registrado en el sistema' });
      }

      // Validar que el usuario pertenece al company enviado
      if (user.company.toString() !== companyId) {
        return reply.code(403).send({
          error: 'El usuario no pertenece a la compañía especificada',
        });
      }
    } catch (err) {
      request.log.error(err);
      return reply.code(401).send({ error: 'Token inválido (catch)' });
    }
  });
}

module.exports = fp(verifyAuthPlugin);

const fp = require('fastify-plugin');

async function verifyAuthPlugin(fastify, opts) {
  fastify.decorateRequest('user', null);

  fastify.addHook('onRequest', async (request, reply) => {
    try {
      const url = request.raw.url;

      // Ignorar preflight
      if (request.method === 'OPTIONS') return;

      // Rutas públicas (ej. Swagger)
      const isPublic = url.startsWith('/docs') || url.startsWith('/public');
      if (isPublic) return;

      const authHeader = request.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return reply.code(401).send({ error: 'Token inválido' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = await fastify.firebaseAdmin.auth().verifyIdToken(token);
      request.user = decoded;
    } catch (err) {
      request.log.error(err); // 👈 log para Render
      return reply.code(401).send({ error: 'Token inválido (catch)' });
    }
  });
}

module.exports = fp(verifyAuthPlugin);

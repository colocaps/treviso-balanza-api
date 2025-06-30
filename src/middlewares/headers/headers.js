const fp = require('fastify-plugin');

async function verifyAuthPlugin(fastify, opts) {
  fastify.decorateRequest('user', null);

  fastify.addHook('onRequest', async (request, reply) => {
    const url = request.raw.url;

    // Excluir rutas públicas como Swagger y otras
    const isPublic = url.startsWith('/docs') || url.startsWith('/public');

    if (isPublic) return;

    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.code(401).send({ error: 'Token requerido' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = await fastify.firebaseAdmin.auth().verifyIdToken(token);
      request.user = decoded;
    } catch (err) {
      return reply.code(401).send({ error: 'Token inválido' });
    }
  });
}

module.exports = fp(verifyAuthPlugin);

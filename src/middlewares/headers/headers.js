const fp = require('fastify-plugin');

async function verifyAuthPlugin(fastify, opts) {
  fastify.decorateRequest('user', null);

  fastify.addHook('onRequest', async (request, reply) => {
    const url = request.raw.url;

    if (request.method === 'OPTIONS') return;

    // Excluir rutas públicas como Swagger y otras
    const isPublic = url.startsWith('/docs') || url.startsWith('/public');

    if (isPublic) return;

    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      const error = new Error('Token inválido');
      error.statusCode = 401;
      throw error;
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = await fastify.firebaseAdmin.auth().verifyIdToken(token);
      request.user = decoded;
    } catch (err) {
      const error = new Error('Token inválido');
      error.statusCode = 401;
      throw error;
    }
  });
}

module.exports = fp(verifyAuthPlugin);

const fp = require('fastify-plugin');

async function verifyAdminPlugin(fastify, opts) {
  fastify.decorateRequest('isAdmin', false);

  fastify.addHook('onRequest', async (request, reply) => {
    const url = request.raw.url;

    // Ignorar preflight
    if (request.method === 'OPTIONS') return;

    // Solo proteger rutas que empiezan con /company (o la que uses para admin)
    if (!url.startsWith('/company')) return;

    // Leer token admin de header
    const adminTokenHeader = request.headers['x-admin-token'];
    const adminToken = process.env.ADMIN_API_TOKEN;

    if (!adminTokenHeader || adminTokenHeader !== adminToken) {
      return reply
        .code(401)
        .send({ error: 'Unauthorized: admin token required' });
    }

    // Marca que este request es admin autorizado
    request.isAdmin = true;
  });
}

module.exports = fp(verifyAdminPlugin);

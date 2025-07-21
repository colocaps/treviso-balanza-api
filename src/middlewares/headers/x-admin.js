const fp = require('fastify-plugin');
const crypto = require('crypto');

// Reemplazá estos valores por tus claves reales y seguras
const ADMIN_SECRET_KEY = process.env.ADMIN_TOKEN_SECRET_KEY; // Debe ser de 32 bytes
const ADMIN_TOKEN_IV = process.env.ADMIN_TOKEN_IV; // Debe ser de 16 bytes

function decryptAdminToken(encryptedToken, key, iv) {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(key, 'utf8'),
    Buffer.from(iv, 'utf8'),
  );
  let decrypted = decipher.update(encryptedToken, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

async function verifyAdminPlugin(fastify, opts) {
  fastify.decorateRequest('isAdmin', false);

  fastify.addHook('onRequest', async (request, reply) => {
    const url = request.raw.url;

    if (request.method === 'OPTIONS') return;
    if (!url.startsWith('/company')) return;

    const adminTokenHeader = request.headers['x-admin-token'];
    if (!adminTokenHeader) {
      return reply
        .code(401)
        .send({ error: 'Unauthorized: admin token required' });
    }

    try {
      const decryptedToken = decryptAdminToken(
        adminTokenHeader,
        ADMIN_SECRET_KEY,
        ADMIN_TOKEN_IV,
      );
      const adminToken = process.env.ADMIN_API_TOKEN; // Token plano esperado

      if (decryptedToken !== adminToken) {
        return reply
          .code(401)
          .send({ error: 'Unauthorized: invalid admin token' });
      }

      request.isAdmin = true;
    } catch (err) {
      request.log.error('Error decrypting admin token', err);
      return reply.code(400).send({ error: 'Invalid admin token format' });
    }
  });
}

module.exports = fp(verifyAdminPlugin);

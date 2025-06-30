// features/auth/index.js
const userController = require('./controller/user.controller');

async function authPlugin(fastify, options) {
  console.log('🔌 Cargando plugin de auth...');
  await fastify.register(userController);
}

module.exports = authPlugin;

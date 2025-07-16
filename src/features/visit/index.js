// features/visit/index.js
const visitController = require('./controller/visit.controller');

async function visitPlugin(fastify, options) {
  console.log('🔌 Cargando plugin de visit...');
  await fastify.register(visitController);
}

module.exports = visitPlugin;

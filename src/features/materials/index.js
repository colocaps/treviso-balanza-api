// features/material/index.js
const materialController = require('./controller/material.controller');

async function materialPlugin(fastify, options) {
  console.log('🔌 Cargando plugin de material...');
  await fastify.register(materialController);
}

module.exports = materialPlugin;

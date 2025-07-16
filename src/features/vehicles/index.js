// features/vehicles/index.js
const vehiclesController = require('./controller/vehicle.controller');

async function vehiclesPlugin(fastify, options) {
  console.log('🔌 Cargando plugin de vehicles...');
  await fastify.register(vehiclesController);
}

module.exports = vehiclesPlugin;

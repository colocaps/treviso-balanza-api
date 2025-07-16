// features/person/index.js
const personController = require('./controller/person.controller');

async function personPlugin(fastify, options) {
  console.log('🔌 Cargando plugin de person...');
  await fastify.register(personController);
}

module.exports = personPlugin;

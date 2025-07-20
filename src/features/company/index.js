// features/company/index.js
const companyController = require('./controller/company.controller');

async function companyPlugin(fastify, options) {
  console.log('🔌 Cargando plugin de company...');
  await fastify.register(companyController);
}

module.exports = companyPlugin;

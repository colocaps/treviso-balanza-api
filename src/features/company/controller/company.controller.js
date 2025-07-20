// features/company/controller/company.controller.js
const companyService = require('../service/company-service');
const {
  createCompanySchema,
  updateCompanySchema,
  softDeleteCompanySchema,
  getCompaniesSchema,
  getCompanyByCodeSchema,
  activateCompanySchema,
} = require('../api/company.api');

async function companyController(fastify, options) {
  // Crear una compañía
  fastify.route({
    method: 'POST',
    url: '/',
    schema: createCompanySchema,
    handler: async (request, reply) => {
      try {
        const company = await companyService.createCompany(request.body);
        return reply.code(201).send({ company });
      } catch (err) {
        request.log.error(err);
        return reply.code(500).send({ error: 'Error al crear la compañía' });
      }
    },
  });

  // Obtener todas las compañías
  fastify.route({
    method: 'GET',
    url: '/companies',
    schema: getCompaniesSchema,
    handler: async (request, reply) => {
      try {
        const companies = await companyService.getAllCompanies();
        return companies;
      } catch (err) {
        request.log.error(err);
        return reply
          .code(500)
          .send({ error: 'Error al obtener las compañías' });
      }
    },
  });

  // Actualizar una compañía
  fastify.route({
    method: 'PUT',
    url: '/:id',
    schema: updateCompanySchema,
    handler: async (request, reply) => {
      try {
        const { id } = request.params;
        const updatedCompany = await companyService.updateCompany(
          id,
          request.body,
        );
        return { company: updatedCompany };
      } catch (err) {
        request.log.error(err);
        return reply
          .code(500)
          .send({ error: 'Error al actualizar la compañía' });
      }
    },
  });

  fastify.route({
    method: 'GET',
    url: '/:code',
    schema: getCompanyByCodeSchema,
    handler: async (request, reply) => {
      try {
        const { code } = request.params;
        const company = await companyService.getCompanyByCode(code);
        return reply.send(company);
      } catch (err) {
        request.log.error(err);
        return reply.code(404).send({ error: err.message });
      }
    },
  });

  // Soft delete de una compañía
  fastify.route({
    method: 'DELETE',
    url: '/:id',
    schema: softDeleteCompanySchema,
    handler: async (request, reply) => {
      try {
        const { id } = request.params;
        await companyService.deactivateCompany(id);
        return reply.code(204).send();
      } catch (err) {
        request.log.error(err);
        return reply.code(500).send({ error: 'Error al eliminar la compañía' });
      }
    },
  });

  fastify.route({
    method: 'PATCH',
    url: '/:id/activate',
    schema: activateCompanySchema,
    handler: async (request, reply) => {
      try {
        const { id } = request.params;
        const activatedCompany = await companyService.activateCompany(id);
        return { company: activatedCompany };
      } catch (err) {
        request.log.error(err);
        return reply.code(500).send({ error: 'Error al activar la compañía' });
      }
    },
  });
}

module.exports = companyController;

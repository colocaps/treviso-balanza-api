// controller/visit-controller.js
const visitService = require('../service/visit.service');

const {
  createVisitSchema,
  addWeighingSchema,
  completeWeighingSchema,
  closeVisitSchema,
  getAllVisitsSchema,
  getOpenVisitsSchema,
  getVisitByIdSchema,
  VisitSchema,
} = require('../api/visit.api');

async function visitController(fastify, options) {
  fastify.addSchema(VisitSchema);
  fastify.route({
    url: '/',
    method: 'POST',
    schema: createVisitSchema,
    handler: async (request, reply) => {
      try {
        const { vehicleId, driverId, personId, operationType, details } =
          request.body;
        const visit = await visitService.createVisit({
          vehicleId,
          driverId,
          personId,
          operationType,
          details,
        });
        return reply.code(201).send(visit);
      } catch (err) {
        request.log.error(err);
        throw err;
      }
    },
  });

  fastify.route({
    url: '/weighings/:visitId',
    method: 'POST',
    schema: addWeighingSchema,
    handler: async (request, reply) => {
      try {
        const { visitId } = request.params;
        const { materialId, weight } = request.body;
        const updatedVisit = await visitService.addWeighing(visitId, {
          materialId,
          weight,
        });
        return reply.code(200).send(updatedVisit);
      } catch (err) {
        request.log.error(err);
        throw err;
      }
    },
  });

  fastify.route({
    url: '/:visitId/weighings/:weighingId',
    method: 'PUT',
    schema: completeWeighingSchema,
    handler: async (request, reply) => {
      try {
        const { visitId, weighingId } = request.params;
        const { weight } = request.body;

        const updatedVisit = await visitService.completeWeighing(
          visitId,
          weighingId,
          weight,
        );

        return reply.code(200).send(updatedVisit);
      } catch (err) {
        request.log.error(err);
        throw err;
      }
    },
  });

  fastify.route({
    url: '/:visitId/close',
    method: 'PUT',
    schema: closeVisitSchema,
    handler: async (request, reply) => {
      try {
        const { visitId } = request.params;

        // Normaliza `details`: si no viene o es null, se convierte en {}
        let details = request.body?.details;
        if (details === null || details === undefined) {
          details = {};
        }

        const closedVisit = await visitService.closeVisit(visitId, details);

        return reply.code(200).send(closedVisit);
      } catch (err) {
        request.log.error(err);
        throw err;
      }
    },
  });

  fastify.route({
    url: '/',
    method: 'GET',
    schema: getAllVisitsSchema,
    handler: async (request, reply) => {
      try {
        const visits = await visitService.getAllVisits();
        return reply.code(200).send(visits);
      } catch (err) {
        request.log.error(err);
        throw err;
      }
    },
  });

  fastify.route({
    url: '/open',
    method: 'GET',
    schema: getOpenVisitsSchema,
    handler: async (request, reply) => {
      try {
        const visits = await visitService.getOpenVisits();
        return reply.code(200).send(visits);
      } catch (err) {
        request.log.error(err);
        throw err;
      }
    },
  });

  fastify.route({
    url: '/:visitId',
    method: 'GET',
    schema: getVisitByIdSchema,
    handler: async (request, reply) => {
      try {
        const { visitId } = request.params;
        const visit = await visitService.getVisitById(visitId);
        if (!visit)
          return reply.code(404).send({ message: 'Visita no encontrada' });
        return reply.code(200).send(visit);
      } catch (err) {
        request.log.error(err);
        throw err;
      }
    },
  });
}

module.exports = visitController;

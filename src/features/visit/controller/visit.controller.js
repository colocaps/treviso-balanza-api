// controller/visit-controller.js
const visitService = require('../service/visit.service');

const {
  createVisitSchema,
  addWeighingSchema,
  completeWeighingSchema,
  closeVisitSchema,
} = require('../api/visit.api');

async function visitController(fastify, options) {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: createVisitSchema,
    handler: async (request, reply) => {
      try {
        const { vehicleId, driverId, personId, operation } = request.body;
        const visit = await visitService.createVisit({
          vehicleId,
          driverId,
          personId,
          operation,
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
        const { materialId, grossWeight } = request.body;
        const updatedVisit = await visitService.addWeighing(visitId, {
          materialId,
          grossWeight,
        });
        return reply.code(200).send(updatedVisit);
      } catch (err) {
        request.log.error(err);
        throw err;
      }
    },
  });

  fastify.route({
    url: '/:visitId/weighings/:weighingId/',
    method: 'PUT',
    schema: completeWeighingSchema,
    handler: async (request, reply) => {
      try {
        const { visitId, weighingId } = request.params;
        const { tareWeight } = request.body;

        const updatedVisit = await visitService.completeWeighing(
          visitId,
          weighingId,
          tareWeight,
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

        const closedVisit = await visitService.closeVisit(visitId);

        return reply.code(200).send(closedVisit);
      } catch (err) {
        request.log.error(err);
        throw err;
      }
    },
  });
}

module.exports = visitController;

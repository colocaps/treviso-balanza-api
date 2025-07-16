// controller/vehicle-controller.js
const vehicleService = require('../service/vehicle.service');
const {
  createVehicleTypeSchema,
  createVehicleSchema,
  getAllVehiclesSchema,
  updateVehicleSchema,
  toggleVehicleSchema,
  updateVehicleTypeSchema,
  toggleVehicleTypeSchema,
  getAllVehiclesTypesSchema,
} = require('../api/vehicle.api');

async function vehicleController(fastify, options) {
  fastify.route({
    method: 'POST',
    url: '/vehicle-type',
    schema: createVehicleTypeSchema,
    handler: async (request, reply) => {
      try {
        const type = await vehicleService.createVehicleType(request.body.name);
        return reply.code(201).send(type);
      } catch (err) {
        reply.code(400).send({ error: err.message });
      }
    },
  });

  fastify.route({
    method: 'GET',
    url: '/vehicle-types',
    schema: getAllVehiclesTypesSchema,
    handler: async (request, reply) => {
      try {
        const types = await vehicleService.getAllVehicleTypes();
        return types;
      } catch (err) {
        reply.code(500).send({ error: err.message });
      }
    },
  });

  fastify.route({
    method: 'POST',
    url: '/vehicle',
    schema: createVehicleSchema,
    handler: async (request, reply) => {
      try {
        const vehicle = await vehicleService.createVehicle(request.body);
        return reply.code(201).send(vehicle);
      } catch (err) {
        reply.code(400).send({ error: err.message });
      }
    },
  });

  fastify.route({
    method: 'GET',
    url: '/vehicles',
    schema: getAllVehiclesSchema,
    handler: async (request, reply) => {
      try {
        const vehicles = await vehicleService.getAllVehicles();
        return vehicles;
      } catch (err) {
        reply.code(500).send({ error: err.message });
      }
    },
  });

  fastify.route({
    method: 'PUT',
    url: '/vehicle/:id',
    schema: updateVehicleSchema,
    handler: async (request, reply) => {
      try {
        const updated = await vehicleService.updateVehicle(
          request.params.id,
          request.body,
        );
        return reply.code(200).send(updated);
      } catch (err) {
        reply.code(400).send({ error: err.message });
      }
    },
  });

  fastify.route({
    method: 'DELETE',
    url: '/vehicle/:id',
    schema: toggleVehicleSchema,
    handler: async (request, reply) => {
      try {
        const toggled = await vehicleService.toggleVehicleActive(
          request.params.id,
        );
        return reply.code(200).send(toggled);
      } catch (err) {
        reply.code(400).send({ error: err.message });
      }
    },
  });
  fastify.route({
    method: 'DELETE',
    url: '/vehicle-type/:id',
    schema: toggleVehicleTypeSchema, // si no lo tenés, te lo paso abajo
    handler: async (request, reply) => {
      try {
        const toggled = await vehicleService.toggleVehicleTypeActive(
          request.params.id,
        );
        return reply.code(200).send(toggled);
      } catch (err) {
        reply.code(400).send({ error: err.message });
      }
    },
  });

  fastify.route({
    method: 'PUT',
    url: '/vehicle-type/:id',
    schema: updateVehicleTypeSchema,
    handler: async (request, reply) => {
      try {
        const { name } = request.body;
        const updated = await vehicleService.updateVehicleType(
          request.params.id,
          name,
        );
        return reply.code(200).send(updated);
      } catch (err) {
        reply.code(400).send({ error: err.message });
      }
    },
  });
}

module.exports = vehicleController;

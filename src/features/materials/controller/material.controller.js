const materialService = require('../service/material-service');

const {
  createMaterialTypeSchema,
  createMaterialClassificationSchema,
  createMaterialSchema,
  getAllMaterialsSchema,
  updateMaterialTypeSchema,
  updateMaterialClassificationSchema,
  toggleMaterialClassificationSchema,
  getAllMaterialTypesSchema,
  getAllMaterialClassificationsSchema,
  updateMaterialSchema,
  toggleMaterialSchema,
  toggleMaterialTypeSchema,
} = require('../api/material.api');

async function materialController(fastify, options) {
  fastify.route({
    url: '/create-type',
    method: 'POST',
    schema: createMaterialTypeSchema,
    handler: async (request, reply) => {
      try {
        const { name } = request.body;
        const type = await materialService.createMaterialType(name);
        return reply.code(201).send(type);
      } catch (err) {
        throw err;
      }
    },
  });

  fastify.route({
    url: '/create-classification',
    method: 'POST',
    schema: createMaterialClassificationSchema,
    handler: async (request, reply) => {
      try {
        const { name, materialTypeId } = request.body;
        const classification =
          await materialService.createMaterialClassification(
            name,
            materialTypeId,
          );
        return reply.code(201).send(classification);
      } catch (err) {
        throw err;
      }
    },
  });

  fastify.route({
    url: '/create',
    method: 'POST',
    schema: createMaterialSchema,
    handler: async (request, reply) => {
      try {
        const { name, classificationId } = request.body;
        const material = await materialService.createMaterial(
          name,
          classificationId,
        );
        return reply.code(201).send(material);
      } catch (err) {
        throw err;
      }
    },
  });

  fastify.route({
    url: '/materials',
    method: 'GET',
    schema: getAllMaterialsSchema,
    handler: async (request, reply) => {
      try {
        const materials = await materialService.getAllMaterials();
        return materials;
      } catch (err) {
        throw err;
      }
    },
  });

  fastify.route({
    url: '/material-type/:id',
    method: 'PUT',
    schema: updateMaterialTypeSchema,
    handler: async (request, reply) => {
      try {
        const updated = await materialService.updateMaterialType(
          request.params.id,
          request.body.name,
        );
        return reply.code(200).send(updated);
      } catch (err) {
        throw err;
      }
    },
  });

  fastify.route({
    url: '/material-type/:id',
    method: 'DELETE',
    schema: toggleMaterialTypeSchema,
    handler: async (request, reply) => {
      try {
        const toggled = await materialService.toggleMaterialTypeActive(
          request.params.id,
        );
        return reply.code(200).send(toggled);
      } catch (err) {
        throw err;
      }
    },
  });

  fastify.route({
    url: '/material-classification/:id',
    method: 'PUT',
    schema: updateMaterialClassificationSchema,
    handler: async (request, reply) => {
      try {
        const updated = await materialService.updateMaterialClassification(
          request.params.id,
          request.body,
        );
        return reply.code(200).send(updated);
      } catch (err) {
        throw err;
      }
    },
  });

  fastify.route({
    url: '/material-classification/:id',
    method: 'DELETE',
    schema: toggleMaterialClassificationSchema,
    handler: async (request, reply) => {
      try {
        const toggled =
          await materialService.toggleMaterialClassificationActive(
            request.params.id,
          );
        return reply.code(200).send(toggled);
      } catch (err) {
        throw err;
      }
    },
  });

  fastify.route({
    method: 'GET',
    url: '/material-types',
    schema: getAllMaterialTypesSchema,
    handler: async (request, reply) => {
      try {
        const types = await materialService.getAllMaterialTypes();
        return types;
      } catch (err) {
        throw err;
      }
    },
  });

  fastify.route({
    method: 'GET',
    url: '/material-classifications',
    schema: getAllMaterialClassificationsSchema,
    handler: async (request, reply) => {
      try {
        const classifications =
          await materialService.getAllMaterialClassifications();
        return classifications;
      } catch (err) {
        throw err;
      }
    },
  });

  fastify.route({
    method: 'PUT',
    url: '/:id',
    schema: updateMaterialSchema,
    handler: async (request, reply) => {
      try {
        const updatedMaterial = await materialService.updateMaterial(
          request.params.id,
          request.body,
        );
        return reply.code(200).send({ material: updatedMaterial });
      } catch (err) {
        request.log.error(err);
        throw err;
      }
    },
  });

  fastify.route({
    url: '/:id',
    method: 'DELETE',
    schema: toggleMaterialSchema,
    handler: async (request, reply) => {
      try {
        const toggled = await materialService.toggleMaterialActive(
          request.params.id,
        );
        return reply.code(200).send(toggled);
      } catch (err) {
        throw err;
      }
    },
  });
}

module.exports = materialController;

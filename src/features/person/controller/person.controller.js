const {
  createPersonIfNotExists,
  updatePersonById,
  getAllPersons,
  getPersonById,
} = require('../service/person.service');
const {
  registerPersonSchemma,
  updatePersonSchema,
  getAllPersonsSchema,
  getPersonByIdSchema,
} = require('../api/person.api');

const { validatePersonTypes } = require('../model/person-model');

async function personController(fastify, options) {
  fastify.route({
    method: 'POST',
    url: '/register',
    schema: registerPersonSchemma,
    handler: async (request, reply) => {
      try {
        validatePersonTypes(request.body.personTypes);
        const person = await createPersonIfNotExists(request.body);
        return reply.code(201).send(person);
      } catch (err) {
        const status = err.statusCode || 500;
        return reply.code(status).send({ error: err.message });
      }
    },
  });

  fastify.route({
    method: 'PUT',
    url: '/update/:id',
    schema: updatePersonSchema,
    handler: async (request, reply) => {
      const { id } = request.params;
      try {
        validatePersonTypes(request.body.personTypes);
        const updatedPerson = await updatePersonById(id, request.body);
        return reply.code(201).send(updatedPerson);
      } catch (err) {
        const status = err.statusCode || 500;
        return reply.code(status).send({ error: err.message });
      }
    },
  });

  fastify.route({
    method: 'GET',
    url: '/persons/',
    schema: getAllPersonsSchema,
    handler: async (request, reply) => {
      try {
        const persons = await getAllPersons();
        return reply.code(200).send(persons);
      } catch (err) {
        throw err;
      }
    },
  });

  fastify.route({
    method: 'GET',
    url: '/:id',
    schema: getPersonByIdSchema,
    handler: async (request, reply) => {
      const { id } = request.params;
      const person = await getPersonById(id);
      try {
        if (!person) {
          const error = new Error('Persona no encontrada');
          error.statusCode = 404;
          throw error;
        }
        return reply.code(200).send(person);
      } catch (e) {
        throw e;
      }
    },
  });
}

module.exports = personController;

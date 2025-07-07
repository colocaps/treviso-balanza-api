const registerPersonSchemma = {
  tags: ['Person'],
  body: {
    type: 'object',
    required: ['name', 'cuit'],
    properties: {
      name: { type: 'string' },
      cuit: { type: 'string' },
      phoneNumber: { type: 'string' },
      personTypes: {
        type: 'array',
        items: { type: 'string' },
      },
    },
  },
  response: {
    201: {
      description: 'Persona creada',
      type: 'object',
      properties: {
        _id: { type: 'string' },
        name: { type: 'string' },
        cuit: { type: 'string' },
        phoneNumber: { type: 'string' },
        personTypes: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
    409: {
      description: 'CUIT ya registrado',
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};

const updatePersonSchema = {
  tags: ['Person'],
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  },
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      cuit: { type: 'string' },
      phoneNumber: { type: 'string' },
      personTypes: {
        type: 'array',
        items: { type: 'string' },
      },
    },
  },
  response: {
    200: {
      description: 'Persona actualizada',
      type: 'object',
    },
    404: {
      description: 'Persona no encontrada',
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};

const getAllPersonsSchema = {
  tags: ['Person'],
  description: 'Obtener todas las personas',
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          cuit: { type: 'string' },
          phoneNumber: { type: 'string' },
          personTypes: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
    },
  },
};
const getPersonByIdSchema = {
  tags: ['Person'],
  description: 'Obtener una persona por ID',
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        name: { type: 'string' },
        cuit: { type: 'string' },
        phoneNumber: { type: 'string' },
        personTypes: {
          type: 'array',
          items: { type: 'string' },
        },
      },
    },
    404: {
      description: 'Persona no encontrada',
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};

module.exports = {
  registerPersonSchemma,
  updatePersonSchema,
  getAllPersonsSchema,
  getPersonByIdSchema,
};

const createVisitSchema = {
  description: 'Crea una nueva visita',
  tags: ['Visit'],
  headers: {
    type: 'object',
    properties: {
      Authorization: {
        type: 'string',
        description: 'Token JWT Bearer de Firebase',
      },
    },
    required: ['Authorization'],
  },
  body: {
    type: 'object',
    properties: {
      vehicleId: { type: 'string' },
      driverId: { type: 'string' },
      personId: { type: 'string' },
      operationType: { type: 'string', enum: ['IN', 'OUT'] },
    },
    required: ['vehicleId', 'driverId', 'personId', 'operationType'],
  },
  response: {
    201: {
      description: 'Visita creada',
      type: 'object',
      properties: {
        _id: { type: 'string' },
        vehicle: { type: 'string' },
        driver: { type: 'string' },
        person: { type: 'string' },
        operationType: { type: 'string' },
        entryDate: { type: 'string' },
        isClosed: { type: 'boolean' },
      },
    },
  },
};

const addWeighingSchema = {
  description: 'Agrega un pesaje a la visita (bruto o tara según operación)',
  tags: ['Visit'],
  headers: {
    type: 'object',
    properties: {
      Authorization: {
        type: 'string',
        description: 'Token JWT Bearer de Firebase',
      },
    },
    required: ['Authorization'],
  },
  params: {
    type: 'object',
    properties: {
      visitId: { type: 'string' },
    },
    required: ['visitId'],
  },
  body: {
    type: 'object',
    properties: {
      materialId: { type: 'string' },
      weight: { type: 'number' },
    },
    required: ['materialId', 'weight'],
  },
};

const completeWeighingSchema = {
  description: 'Completa un pesaje con el segundo peso',
  tags: ['Visit'],
  headers: {
    type: 'object',
    properties: {
      Authorization: {
        type: 'string',
        description: 'Token JWT Bearer de Firebase',
      },
    },
    required: ['Authorization'],
  },
  params: {
    type: 'object',
    properties: {
      visitId: { type: 'string' },
      weighingId: { type: 'string' },
    },
    required: ['visitId', 'weighingId'],
  },
  body: {
    type: 'object',
    properties: {
      weight: { type: 'number' },
    },
    required: ['weight'],
  },
};

const closeVisitSchema = {
  description: 'Cierra la visita si todos los pesajes están finalizados',
  tags: ['Visit'],
  headers: {
    type: 'object',
    properties: {
      Authorization: {
        type: 'string',
        description: 'Token JWT Bearer de Firebase',
      },
    },
    required: ['Authorization'],
  },
  params: {
    type: 'object',
    properties: {
      visitId: { type: 'string' },
    },
    required: ['visitId'],
  },
};

module.exports = {
  createVisitSchema,
  addWeighingSchema,
  completeWeighingSchema,
  closeVisitSchema,
};

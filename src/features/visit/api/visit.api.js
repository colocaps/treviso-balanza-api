const VisitSchema = {
  $id: 'Visit',
  type: 'object',
  properties: {
    _id: { type: 'string' },
    vehicle: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        brand: { type: 'string' },
        model: { type: 'string' },
        plate: { type: 'string' },
        vehicleType: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            isActive: { type: 'boolean' },
          },
        },
      },
    },
    driver: {
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
    person: {
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
    operationType: { type: 'string', enum: ['IN', 'OUT'] },
    entryDate: { type: 'string', format: 'date-time' },
    exitDate: { type: 'string', format: 'date-time' },
    isClosed: { type: 'boolean' },
    weighings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          material: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              name: { type: 'string' },
              classification: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  name: { type: 'string' },
                  materialType: {
                    type: 'object',
                    properties: {
                      _id: { type: 'string' },
                      name: { type: 'string' },
                      isActive: { type: 'boolean' },
                    },
                  },
                  isActive: { type: 'boolean' },
                },
              },
              isActive: { type: 'boolean' },
            },
          },
          grossWeight: { type: 'number' },
          tareWeight: { type: 'number' },
          netWeight: { type: 'number' },
          isClosed: { type: 'boolean' },
        },
      },
    },
    details: { type: 'string' },
  },
};

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
      'x-company-id': {
        type: 'string',
        description: 'el id de la compañia',
      },
    },
    required: ['Authorization', 'x-company-id'],
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
        details: { type: 'string' },
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
      'x-company-id': {
        type: 'string',
        description: 'el id de la compañia',
      },
    },
    required: ['Authorization', 'x-company-id'],
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
      'x-company-id': {
        type: 'string',
        description: 'el id de la compañia',
      },
    },
    required: ['Authorization', 'x-company-id'],
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
      'x-company-id': {
        type: 'string',
        description: 'el id de la compañia',
      },
    },
    required: ['Authorization', 'x-company-id'],
  },
  params: {
    type: 'object',
    properties: {
      visitId: { type: 'string' },
    },
    required: ['visitId'],
  },
};
const getAllVisitsSchema = {
  description: 'Obtiene todas las visitas registradas',
  tags: ['Visit'],
  headers: {
    type: 'object',
    properties: {
      Authorization: {
        type: 'string',
        description: 'Token JWT Bearer de Firebase',
      },
      'x-company-id': {
        type: 'string',
        description: 'el id de la compañia',
      },
    },
    required: ['Authorization', 'x-company-id'],
  },
  response: {
    200: {
      type: 'array',
      items: VisitSchema, // si tenés una definición $ref Visit, o reemplazar por un esquema inline
    },
  },
};
const getOpenVisitsSchema = {
  description: 'Obtiene todas las visitas que no están cerradas',
  tags: ['Visit'],
  headers: {
    type: 'object',
    properties: {
      Authorization: {
        type: 'string',
        description: 'Token JWT Bearer de Firebase',
      },
      'x-company-id': {
        type: 'string',
        description: 'el id de la compañia',
      },
    },
    required: ['Authorization', 'x-company-id'],
  },
  response: {
    200: {
      type: 'array',
      items: VisitSchema,
    },
  },
};
const getVisitByIdSchema = {
  description: 'Obtiene el detalle completo de una visita específica',
  tags: ['Visit'],
  headers: {
    type: 'object',
    properties: {
      Authorization: {
        type: 'string',
        description: 'Token JWT Bearer de Firebase',
      },
      'x-company-id': {
        type: 'string',
        description: 'el id de la compañia',
      },
    },
    required: ['Authorization', 'x-company-id'],
  },
  params: {
    type: 'object',
    properties: {
      visitId: { type: 'string', description: 'ID de la visita' },
    },
    required: ['visitId'],
  },
  response: {
    200: { $ref: 'Visit#' },
    404: {
      type: 'object',
      properties: {
        message: VisitSchema,
      },
    },
  },
};

module.exports = {
  createVisitSchema,
  addWeighingSchema,
  completeWeighingSchema,
  closeVisitSchema,
  getAllVisitsSchema,
  getOpenVisitsSchema,
  getVisitByIdSchema,
  VisitSchema,
};

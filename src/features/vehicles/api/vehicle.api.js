// api/vehicle.api.js
const createVehicleTypeSchema = {
  description: 'Crea un tipo de vehículo',
  tags: ['Vehicle'],
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
      name: { type: 'string', minLength: 1 },
    },
    required: ['name'],
  },
  response: {
    201: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        name: { type: 'string' },
        isActive: { type: 'boolean' },
        vehicleType: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
          },
        },
      },
    },
  },
};

const createVehicleSchema = {
  description: 'Crea un vehículo',
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
  tags: ['Vehicle'],
  body: {
    type: 'object',
    properties: {
      brand: { type: 'string', minLength: 1 },
      model: { type: 'string', minLength: 1 },
      plate: { type: 'string', minLength: 4 },
      vehicleTypeId: { type: 'string', minLength: 1 },
    },
    required: ['brand', 'model', 'plate', 'vehicleTypeId'],
  },
  response: {
    201: {
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
        isActive: { type: 'boolean' },
      },
    },
  },
};

const getAllVehiclesSchema = {
  description: 'Obtiene todos los vehículos activos',
  tags: ['Vehicle'],
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
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          brand: { type: 'string' },
          plate: { type: 'string' },
          model: { type: 'string' },
          isActive: { type: 'boolean' },
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
    },
  },
};
const getAllVehiclesTypesSchema = {
  description: 'Obtiene todos los tipoes de vehículos activos',
  tags: ['Vehicle'],
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
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          isActive: { type: 'boolean' },
        },
      },
    },
  },
};

const updateVehicleSchema = {
  description: 'Actualiza un vehículo',
  tags: ['Vehicle'],
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
      id: { type: 'string' },
    },
    required: ['id'],
  },
  body: {
    type: 'object',
    properties: {
      brand: { type: 'string' },
      model: { type: 'string' },
      plate: { type: 'string' },
      vehicleTypeId: { type: 'string' },
      isActive: { type: 'boolean' },
    },
    additionalProperties: false,
  },
  response: {
    200: {
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

        isActive: { type: 'boolean' },
      },
    },
  },
};

const toggleVehicleSchema = {
  description: 'Activa o desactiva un vehículo (soft delete)',
  tags: ['Vehicle'],
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
      id: { type: 'string', description: 'ID del vehículo' },
    },
    required: ['id'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        brand: { type: 'string' },
        model: { type: 'string' },
        plate: { type: 'string' },
        isActive: { type: 'boolean' },
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
  },
};
const updateVehicleTypeSchema = {
  description: 'Actualiza un tipo de vehículo',
  tags: ['Vehicle'],
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
    properties: { id: { type: 'string' } },
    required: ['id'],
  },
  body: {
    type: 'object',
    properties: { name: { type: 'string' } },
    required: ['name'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        name: { type: 'string' },
        isActive: { type: 'boolean' },
      },
    },
  },
};

const toggleVehicleTypeSchema = {
  description: 'Activa o desactiva un tipo de vehículo (soft delete)',
  tags: ['Vehicle'],
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
    properties: { id: { type: 'string' } },
    required: ['id'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        name: { type: 'string' },
        isActive: { type: 'boolean' },
      },
    },
  },
};

module.exports = {
  createVehicleTypeSchema,
  createVehicleSchema,
  getAllVehiclesSchema,
  updateVehicleSchema,
  toggleVehicleSchema,
  updateVehicleTypeSchema,
  toggleVehicleTypeSchema,
  getAllVehiclesTypesSchema,
};

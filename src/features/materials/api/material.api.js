const createMaterialTypeSchema = {
  description: 'Crea un nuevo tipo de material',
  tags: ['Material'],
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
      },
    },
  },
};
const createMaterialClassificationSchema = {
  description: 'Crea una clasificación dentro de un tipo de material',
  tags: ['Material'],
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
      materialTypeId: { type: 'string', minLength: 1 },
    },
    required: ['name', 'materialTypeId'],
  },
  response: {
    201: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        name: { type: 'string' },
        materialType: { type: 'string' },
        isActive: { type: 'boolean' },
      },
    },
  },
};
const createMaterialSchema = {
  description: 'Crea un nuevo material',
  tags: ['Material'],
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
      classificationId: { type: 'string', minLength: 1 },
    },
    required: ['name', 'classificationId'],
  },
  response: {
    201: {
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
        classification: {
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
const getAllMaterialsSchema = {
  description: 'Obtiene todos los materiales con su tipo y clasificación',
  tags: ['Material'],
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
          classification: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              name: { type: 'string' },
              isActive: { type: 'boolean' },
              materialType: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  name: { type: 'string' },
                  isActive: { type: 'boolean' },
                },
                required: ['_id', 'name', 'isActive'],
              },
            },
            required: ['_id', 'name', 'isActive', 'materialType'],
          },
          isActive: { type: 'boolean' },
        },
        required: ['_id', 'name', 'classification', 'isActive'],
      },
    },
  },
};

const updateMaterialTypeSchema = {
  description: 'Actualiza un tipo de material por ID',
  tags: ['Material'],
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
      name: { type: 'string' },
    },
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
const updateMaterialClassificationSchema = {
  description: 'Actualiza una clasificación de material por ID',
  tags: ['Material'],
  headers: {
    type: 'object',
    properties: {
      Authorization: { type: 'string' },
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
      name: { type: 'string' },
      materialTypeId: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        name: { type: 'string' },
        materialType: { type: 'string' },
        isActive: { type: 'boolean' },
      },
    },
  },
};

const updateMaterialSchema = {
  description: 'Actualiza un material por ID',
  tags: ['Material'],
  headers: {
    type: 'object',
    properties: {
      Authorization: { type: 'string' },
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
      name: { type: 'string' },
      materialTypeId: { type: 'string' },
      classificationId: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        name: { type: 'string' },
        materialType: { type: 'string' },
        classification: { type: 'string' },
        isActive: { type: 'boolean' },
      },
    },
  },
};

const toggleMaterialTypeSchema = {
  description: 'Activa o desactiva un tipo de material (soft delete)',
  tags: ['Material'],
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
      id: { type: 'string', description: 'ID del tipo de material' },
    },
    required: ['id'],
  },
  response: {
    200: {
      description: 'Tipo de material actualizado con estado activo/inactivo',
      type: 'object',
      properties: {
        _id: { type: 'string' },
        name: { type: 'string' },
        isActive: { type: 'boolean' },
      },
    },
  },
};

const getAllMaterialTypesSchema = {
  description: 'Obtiene todos los tipos de materiales activos',
  tags: ['Material'],
  headers: {
    type: 'object',
    properties: {
      Authorization: { type: 'string' },
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
          active: { type: 'boolean' },
        },
      },
    },
  },
};

const getAllMaterialClassificationsSchema = {
  description:
    'Obtiene todas las clasificaciones de materiales activas con su tipo asociado',
  tags: ['Material'],
  headers: {
    type: 'object',
    properties: {
      Authorization: { type: 'string' },
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
          active: { type: 'boolean' },
          materialType: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              name: { type: 'string' },
              active: { type: 'boolean' },
            },
          },
        },
      },
    },
  },
};

const toggleMaterialSchema = {
  description: 'Desactiva o activa un material (soft delete)',
  tags: ['Material'],
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
      id: { type: 'string', description: 'ID del material' },
    },
    required: ['id'],
  },
  response: {
    200: {
      description: 'Material actualizado con estado activo/inactivo',
      type: 'object',
      properties: {
        _id: { type: 'string' },
        name: { type: 'string' },
        isActive: { type: 'boolean' },
        classification: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            isActive: { type: 'boolean' },
            materialType: {
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
  },
};

const toggleMaterialClassificationSchema = {
  description: 'Activa o desactiva una clasificación de material (soft delete)',
  tags: ['Material'],
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
      id: { type: 'string', description: 'ID de la clasificación' },
    },
    required: ['id'],
  },
  response: {
    200: {
      description: 'Clasificación actualizada con estado activo/inactivo',
      type: 'object',
      properties: {
        _id: { type: 'string' },
        name: { type: 'string' },
        isActive: { type: 'boolean' },
        materialType: {
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

module.exports = {
  createMaterialTypeSchema,
  createMaterialClassificationSchema,
  createMaterialSchema,
  getAllMaterialsSchema,
  updateMaterialTypeSchema,
  updateMaterialClassificationSchema,
  updateMaterialSchema,
  getAllMaterialTypesSchema,
  getAllMaterialClassificationsSchema,
  toggleMaterialSchema,
  toggleMaterialClassificationSchema,
  toggleMaterialTypeSchema,
};

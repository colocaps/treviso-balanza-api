const CompanySchema = {
  $id: 'Company',
  type: 'object',
  headers: {
    type: 'object',
    properties: {
      'x-admin-token': {
        type: 'string',
        description: 'x-admin token',
      },
    },
    required: ['x-admin-token'],
  },
  properties: {
    _id: { type: 'string' },
    name: { type: 'string', minLength: 1 },
    cuit: { type: 'string', minLength: 6 },
    socialReason: { type: 'string' },
    address: { type: 'string' },
    phoneNumber: { type: 'string' },
    email: { type: 'string', format: 'email' },
    isActive: { type: 'boolean' },
    logo: { type: 'string' },
    code: { type: 'string', minLength: 6, maxLength: 6 },
  },
};

// Crear compañía
const createCompanySchema = {
  description: 'Crear una nueva compañía',
  tags: ['Company'],
  headers: {
    type: 'object',
    properties: {
      'x-admin-token': {
        type: 'string',
        description: 'x-admin-token token',
      },
    },
    required: ['x-admin-token'],
  },
  body: {
    type: 'object',
    required: ['name', 'cuit'],
    properties: {
      name: { type: 'string', minLength: 1 },
      cuit: { type: 'string', minLength: 6 },
      socialReason: { type: 'string' },
      address: { type: 'string' },
      phoneNumber: { type: 'string' },
      email: { type: 'string', format: 'email' },
      logo: { type: 'string' },
    },
  },
  response: {
    201: {
      type: 'object',
      properties: {
        company: CompanySchema,
      },
    },
  },
};

// Actualizar compañía
const updateCompanySchema = {
  description: 'Actualizar datos de una compañía',
  tags: ['Company'],
  headers: {
    type: 'object',
    properties: {
      'x-admin-token': {
        type: 'string',
        description: 'x-admin-token token',
      },
    },
    required: ['x-admin-token'],
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
      name: { type: 'string', minLength: 1 },
      cuit: { type: 'string', minLength: 6 },
      socialReason: { type: 'string' },
      address: { type: 'string' },
      phoneNumber: { type: 'string' },
      email: { type: 'string', format: 'email' },
      isActive: { type: 'boolean' },
      logo: { type: 'string' },
    },
    additionalProperties: false,
  },
  response: {
    200: {
      type: 'object',
      properties: {
        company: CompanySchema,
      },
    },
  },
};

// Soft delete compañía
const softDeleteCompanySchema = {
  description: 'Desactivar (soft delete) una compañía',
  tags: ['Company'],
  headers: {
    type: 'object',
    properties: {
      'x-admin-token': {
        type: 'string',
        description: 'x-admin-token token',
      },
    },
    required: ['x-admin-token'],
  },
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  },
  response: {
    204: { type: 'null' },
  },
};

// Obtener todas las compañías
const getCompaniesSchema = {
  description: 'Obtener la lista de compañías',
  tags: ['Company'],
  headers: {
    type: 'object',
    properties: {
      'x-admin-token': {
        type: 'string',
        description: 'x-admin-token token',
      },
    },
    required: ['x-admin-token'],
  },
  response: {
    200: {
      type: 'array',
      items: CompanySchema,
    },
  },
};

const getCompanyByCodeSchema = {
  description: 'Obtiene la compañía por su código único',
  tags: ['Company'],
  headers: {
    type: 'object',
    properties: {
      'x-admin-token': {
        type: 'string',
        description: 'x-admin-token token',
      },
    },
    required: ['x-admin-token'],
  },
  params: {
    type: 'object',
    properties: {
      code: { type: 'string', description: 'Código único de la compañía' },
    },
    required: ['code'],
  },
  response: {
    200: { $ref: 'Company#' },
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};

const activateCompanySchema = {
  description: 'Reactivar una compañía desactivada',
  tags: ['Company'],
  headers: {
    type: 'object',
    properties: {
      'x-admin-token': {
        type: 'string',
        description: 'x-admin-token token',
      },
    },
    required: ['x-admin-token'],
  },
  params: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'ID de la compañía' },
    },
    required: ['id'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        company: { $ref: 'Company#' },
      },
    },
  },
};

module.exports = {
  CompanySchema,
  createCompanySchema,
  updateCompanySchema,
  softDeleteCompanySchema,
  getCompaniesSchema,
  getCompanyByCodeSchema,
  activateCompanySchema,
};

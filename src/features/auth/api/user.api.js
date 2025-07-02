// features/auth/api/login.api.js
const errorResponseSchema = require('../../../middlewares/errors/error-response.schemma');

const registerSchemma = {
  description:
    'Registra un usuario nuevo verificando el token Firebase y creando datos adicionales',
  tags: ['Auth'],
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
      lastname: { type: 'string', minLength: 1 },
      dni: { type: 'string', minLength: 6 },
      email: { type: 'string', minLength: 6 },
      profile: { type: 'string' },
    },
    required: ['name', 'lastname', 'dni', 'email'],
  },
  response: {
    201: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            uid: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            lastname: { type: 'string' },
            dni: { type: 'string' },
            profile: { type: 'string' },
          },
        },
      },
    },
  },
};

const getUserSchemma = {
  description: 'Obtener datos del usuario',
  tags: ['Auth'],
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
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            uid: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            lastname: { type: 'string' },
            dni: { type: 'string' },
            profile: { type: 'string' },
          },
        },
      },
    },
  },
};

const getUsersSchemma = {
  description: 'Obtiene la lista de usuarios registrados',
  tags: ['Auth'],
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
      description: 'Lista de usuarios',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          uid: { type: 'string', example: 'abc123' },
          email: { type: 'string', example: 'usuario@example.com' },
          name: { type: 'string', example: 'Juan' },
          lastname: { type: 'string', example: 'Pérez' },
          dni: { type: 'string', example: '12345678' },
          profile: { type: 'string', example: '64f7cdebe1f4b11234567890' },
        },
      },
      example: [
        {
          uid: 'abc123',
          email: 'usuario1@example.com',
          name: 'Juan',
          lastname: 'Pérez',
          dni: '12345678',
          profile: '64f7cdebe1f4b11234567890',
        },
        {
          uid: 'def456',
          email: 'usuario2@example.com',
          name: 'Ana',
          lastname: 'García',
          dni: '87654321',
          profile: '64f7cdebe1f4b10987654321',
        },
      ],
    },
  },
};

const updateUserSchema = {
  description: 'Actualiza los datos del usuario autenticado',
  tags: ['Auth'],
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
      name: { type: 'string' },
      lastname: { type: 'string' },
      dni: { type: 'string' },
      profile: { type: 'string' }, // nombre del perfil
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            uid: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            lastname: { type: 'string' },
            dni: { type: 'string' },
            profile: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                name: { type: 'string' },
                permissions: {
                  type: 'array',
                  items: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = {
  getUserSchemma,
  registerSchemma,
  getUsersSchemma,
  updateUserSchema,
};

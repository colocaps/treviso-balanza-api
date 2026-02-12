// features/auth/api/login.api.js

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
      name: { type: 'string', minLength: 1 },
      lastname: { type: 'string', minLength: 1 },
      dni: { type: 'string', minLength: 8 },
      email: { type: 'string', minLength: 6 },
      profile: { type: 'string' },
      company: { type: 'string' },
    },
    required: ['name', 'lastname', 'dni', 'email'],
  },
  // Sin response schema: Fastify serializa según el schema y "user: { type: 'object' }" sin properties
  // devuelve {} y vacía el objeto. Dejamos que la respuesta se envíe tal cual.
  response: {},
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
      'x-company-id': {
        type: 'string',
        description: 'el id de la compañia',
      },
    },
    required: ['Authorization', 'x-company-id'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
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
              required: ['_id', 'name', 'permissions'],
            },
            company: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                name: { type: 'string' },
                cuit: { type: 'string' },
                socialReason: { type: 'string' },
                logo: { type: 'string' },
                isActive: { type: 'boolean' },
              },
            },
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
      'x-company-id': {
        type: 'string',
        description: 'el id de la compañia',
      },
    },
    required: ['Authorization', 'x-company-id'],
  },
  response: {
    200: {
      description: 'Lista de usuarios',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          uid: { type: 'string', example: 'abc123' },
          email: { type: 'string', example: 'usuario@example.com' },
          name: { type: 'string', example: 'Juan' },
          lastname: { type: 'string', example: 'Pérez' },
          dni: { type: 'string', example: '12345678' },
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
          company: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              name: { type: 'string' },
              cuit: { type: 'string' },
              socialReason: { type: 'string' },
              logo: { type: 'string' },
              isActive: { type: 'boolean' },
            },
          },
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
      name: { type: 'string' },
      lastname: { type: 'string' },
      email: { type: 'string' },
      dni: { type: 'string' },
      profile: { type: 'string' },
      company: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          cuit: { type: 'string' },
          socialReason: { type: 'string' },
          logo: { type: 'string' },
          isActive: { type: 'boolean' },
        },
      },
    },
    additionalProperties: false,
  },
  response: {
    200: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
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
            company: {
              type: 'object',
              properties: {
                _id: { type: 'string' },
                name: { type: 'string' },
                cuit: { type: 'string' },
                socialReason: { type: 'string' },
                logo: { type: 'string' },
                isActive: { type: 'boolean' },
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

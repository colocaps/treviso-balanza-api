// index.js
const Fastify = require('fastify');
const mongoose = require('mongoose');
const errorHandler = require('./errors/error-handler');
const swagger = require('@fastify/swagger');
const swaggerUI = require('@fastify/swagger-ui');

require('dotenv').config();

const fastify = Fastify({ logger: true });
fastify.setErrorHandler(errorHandler);

const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;

async function start() {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    fastify.log.info('✅ Conectado a MongoDB');

    // Registro de swagger
    await fastify.register(swagger, {
      swagger: {
        info: {
          title: 'API Treviso Balanza',
          description: 'Documentación de la API con Fastify + Swagger',
          version: '1.0.0',
        },
        host: `localhost:${port}`,
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
      },
    });

    await fastify.register(swaggerUI, {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: false,
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
    });

    // Rutas
    fastify.get('/', {
      schema: {
        description: 'Ruta principal',
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
      handler: async () => {
        return { message: 'Hola desde Fastify + MongoDB' };
      },
    });

    fastify.get('/error', {
      schema: {
        description: 'Ruta para probar error',
        response: {
          400: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
      handler: async () => {
        const error = new Error('Este es un error de prueba');
        error.statusCode = 400;
        throw error;
      },
    });

    await fastify.listen({ port, host: '0.0.0.0' });
    fastify.log.info(`🚀 Servidor escuchando en el puerto ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();

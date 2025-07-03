// index.js
const Fastify = require('fastify');
const mongoose = require('mongoose');
const errorHandler = require('./middlewares/errors/error-handler');
const swagger = require('@fastify/swagger');
const swaggerUI = require('@fastify/swagger-ui');
const AutoLoad = require('@fastify/autoload');
const path = require('path');

require('dotenv').config();

const fastify = Fastify({
  logger: true,
});

fastify.setErrorHandler(errorHandler);

const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;

async function start() {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await fastify.register(require('./services/firebase'));
    await fastify.register(require('./middlewares/headers/headers'));

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
      securityDefinitions: {
        BearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: 'JWT Bearer token',
        },
      },
      security: [{ BearerAuth: [] }],
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
    await fastify.register(require('@fastify/cors'), {
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });

    await fastify.register(require('./features/auth'), {
      prefix: '/auth', // 👈 esto define la ruta base
    });

    fastify.listen({ port, host: '0.0.0.0' });
    fastify.log.info(`🚀 Servidor escuchando en el puerto ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();

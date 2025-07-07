// index.js
const Fastify = require('fastify');
const mongoose = require('mongoose');
const errorHandler = require('./middlewares/errors/error-handler');
const swagger = require('@fastify/swagger');
const swaggerUI = require('@fastify/swagger-ui');
const fastifyCors = require('@fastify/cors');

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
    const allowedOrigins = [
      // ***** ESTE ES EL MÁS IMPORTANTE PARA TU DESARROLLO LOCAL *****
      'http://localhost:5000', // EJEMPLO: Si Flutter Web se ejecuta en http://localhost:5000
      'http://127.0.0.1:5000', // A veces localhost se resuelve a 127.0.0.1

      // También mantén los dominios de tu API de Render para cuando sí la despliegues,
      // o para otras pruebas si las haces desde esos dominios.
      'https://treviso-balanza-api.onrender-dev.com',
      'https://treviso-balanza-api.onrender.com',
      'https://balanza-dev.onrender.com/',

      // Si estás probando desde otro dispositivo en tu red local (ej. tu celular),
      // también deberías añadir la IP de tu máquina host y el puerto de Flutter.
      // Ejemplo: 'http://192.168.1.X:XXXX'
    ];

    await fastify.register(fastifyCors, {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos HTTP que permites
      allowedHeaders: 'Content-Type, Authorization', // Encabezados personalizados que permites
      // credentials: true, // Si tu cliente necesita enviar cookies o credenciales
    });

    await fastify.register(require('./features/auth'), {
      prefix: '/auth', // 👈 esto define la ruta base
    });

    await fastify.register(require('./features/person'), {
      prefix: '/person', // 👈 esto define la ruta base
    });

    fastify.listen({ port, host: '0.0.0.0' });
    fastify.log.info(`🚀 Servidor escuchando en el puerto ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();

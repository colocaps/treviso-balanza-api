// errors/errorHandler.js

function errorHandler(error, request, reply) {
  const statusCode =
    error.statusCode && error.statusCode >= 400 ? error.statusCode : 500;

  const response = {
    error: {
      message: error.message || 'Internal Server Error',
      code: statusCode,
    },
  };

  if (process.env.NODE_ENV === 'development') {
    response.error.stack = error.stack;
    response.error.validation = error.validation || null;
  }

  reply.status(statusCode).send(response);
}

module.exports = errorHandler;

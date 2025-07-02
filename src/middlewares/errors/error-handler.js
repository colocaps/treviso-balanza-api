// errors/error-handler.js

function errorHandler(error, request, reply) {
  const statusCode =
    error.statusCode && error.statusCode >= 400 ? error.statusCode : 500;

  const errorResponse = {
    error: {
      message: String(error.message || 'Internal Server Error'), // 👈 esto lo forza a string
      code: statusCode,
    },
  };

  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = error.stack;
    if (error.validation) {
      errorResponse.error.validation = error.validation;
    }
  }

  reply.status(statusCode).send(errorResponse);
}

module.exports = errorHandler;

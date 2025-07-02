const errorResponseSchema = {
  type: 'object',
  properties: {
    error: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        code: { type: 'integer' },
      },
      required: ['message', 'code'],
    },
  },
  required: ['error'],
};

module.exports = errorResponseSchema;

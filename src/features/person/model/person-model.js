const mongoose = require('mongoose');

const personTypesEnum = ['conductor', 'cliente', 'proveedor'];

const personSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    cuit: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
    },
    personTypes: [
      {
        type: String,
        enum: personTypesEnum,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Person = mongoose.model('Person', personSchema);

function validatePersonTypes(types = []) {
  const invalid = types.filter((t) => !personTypesEnum.includes(t));
  if (invalid.length > 0) {
    const error = new Error(
      `Tipos de persona inválidos: ${invalid.join(', ')}`,
    );
    error.statusCode = 400;
    throw error;
  }
}
module.exports = {
  Person,
  validatePersonTypes,
};

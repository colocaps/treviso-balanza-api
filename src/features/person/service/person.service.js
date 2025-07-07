const { Person } = require('../model/person-model');

async function getAllPersons() {
  return await Person.find({});
}

async function getPersonById(id) {
  return await Person.findById(id);
}

async function createPersonIfNotExists(data) {
  const existing = await Person.findOne({ cuit: data.cuit });

  if (existing) {
    throw new Error('Persona ya registrada con ese CUIT');
  }

  const person = new Person(data);
  await person.save();
  return person;
}

async function updatePersonById(id, data) {
  const updated = await Person.findByIdAndUpdate(id, data, {
    new: true, // Devuelve el documento modificado
    runValidators: true, // Aplica validaciones del schema
  });

  if (!updated) {
    const error = new Error('Persona no encontrada');
    error.statusCode = 404;
    throw error;
  }

  return updated;
}

module.exports = {
  getAllPersons,
  createPersonIfNotExists,
  getPersonById,
  updatePersonById,
};

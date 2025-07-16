const Visit = require('../model/visit');

async function createVisit({ vehicleId, driverId, personId, operationType }) {
  return await Visit.create({
    vehicle: vehicleId,
    driver: driverId,
    person: personId,
    operationType,
    entryDate: new Date(),
    isClosed: false,
    weighings: [],
  });
}

async function addWeighing(visitId, { materialId, weight }) {
  const visit = await Visit.findById(visitId);
  if (!visit) throw new Error('Visita no encontrada');

  visit.weighings.push({
    material: materialId,
    isClosed: false,
    ...(visit.operationType === 'IN'
      ? { grossWeight: weight }
      : { tareWeight: weight }),
  });

  await visit.save();
  return visit;
}

async function completeWeighing(visitId, weighingId, weight) {
  const visit = await Visit.findById(visitId);
  if (!visit) throw new Error('Visita no encontrada');

  const weighing = visit.weighings.id(weighingId);
  if (!weighing) throw new Error('Pesaje no encontrado');

  if (weighing.isClosed) throw new Error('El pesaje ya está cerrado');

  if (visit.operationType === 'IN') {
    if (weighing.tareWeight != null) {
      throw new Error('La tara ya fue registrada para este pesaje');
    }
    weighing.tareWeight = weight;
    weighing.netWeight = weighing.grossWeight - weighing.tareWeight;
  } else {
    if (weighing.grossWeight != null) {
      throw new Error('El peso bruto ya fue registrado para este pesaje');
    }
    weighing.grossWeight = weight;
    weighing.netWeight = weighing.grossWeight - weighing.tareWeight;
  }

  weighing.isClosed = true;
  await visit.save();
  return visit;
}

async function closeVisit(visitId) {
  const visit = await Visit.findById(visitId);
  if (!visit) throw new Error('Visita no encontrada');

  if (visit.isClosed) {
    throw new Error('La visita ya está cerrada');
  }

  const allWeighingsClosed = visit.weighings.every((w) => w.isClosed);
  if (!allWeighingsClosed) {
    throw new Error('No se puede cerrar la visita: hay pesajes sin finalizar');
  }

  visit.isClosed = true;
  visit.exitDate = new Date();
  await visit.save();

  return visit;
}

module.exports = {
  createVisit,
  addWeighing,
  completeWeighing,
  closeVisit,
};

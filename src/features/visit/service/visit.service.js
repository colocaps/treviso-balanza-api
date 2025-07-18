const Visit = require('../model/visit');

async function createVisit({
  vehicleId,
  driverId,
  personId,
  operationType,
  details,
}) {
  return await Visit.create({
    vehicle: vehicleId,
    driver: driverId,
    person: personId,
    operationType,
    entryDate: new Date(),
    isClosed: false,
    weighings: [],
    details: details,
  });
}

async function addWeighing(visitId, { materialId, weight }) {
  const visit = await Visit.findById(visitId);
  if (!visit) throw new Error('Visita no encontrada');

  // Validación: no permitir agregar otro weighing si hay alguno abierto
  if (visit.weighings.some((w) => !w.isClosed)) {
    throw new Error(
      'No se puede agregar un nuevo pesaje hasta que el anterior esté cerrado',
    );
  }

  const lastWeighing = visit.weighings[visit.weighings.length - 1];

  if (visit.operationType === 'IN') {
    if (lastWeighing?.tareWeight != null && weight > lastWeighing.tareWeight) {
      throw new Error(
        'El peso bruto no puede ser mayor a la última tara registrada',
      );
    }
  } else if (visit.operationType === 'OUT') {
    if (
      lastWeighing?.grossWeight != null &&
      weight < lastWeighing.grossWeight
    ) {
      throw new Error(
        'La tara no puede ser menor al último peso bruto registrado',
      );
    }
  }

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
  if (typeof weight !== 'number' || weight <= 0) {
    throw new Error('Peso inválido, debe ser un número positivo');
  }

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
  } else {
    if (weighing.grossWeight != null) {
      throw new Error('El peso bruto ya fue registrado para este pesaje');
    }
    weighing.grossWeight = weight;
  }

  // Calculamos neto solo si ya tenemos ambos pesos
  if (weighing.grossWeight != null && weighing.tareWeight != null) {
    weighing.netWeight = weighing.grossWeight - weighing.tareWeight;
  }

  // Cerramos el pesaje solo si neto ya está calculado (ambos pesos presentes)
  if (weighing.netWeight != null) {
    weighing.isClosed = true;
  }

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

  // ✅ Calcular totales generales
  const firstGross =
    visit.weighings.find((w) => w.grossWeight != null)?.grossWeight || 0;

  const lastTare =
    [...visit.weighings].reverse().find((w) => w.tareWeight != null)
      ?.tareWeight || 0;

  visit.totalGrossWeight = firstGross;
  visit.totalTareWeight = lastTare;
  visit.totalNetWeight = firstGross - lastTare;

  visit.isClosed = true;
  visit.exitDate = new Date();
  await visit.save();

  return visit;
}

async function getOpenVisits() {
  return await Visit.find({ isClosed: false })
    .populate({
      path: 'vehicle',
      populate: { path: 'vehicleType' },
    })
    .populate('driver')
    .populate('person')
    .populate({
      path: 'weighings.material',
      populate: {
        path: 'classification',
        populate: { path: 'materialType' },
      },
    });
}

async function getAllVisits() {
  return await Visit.find()
    .populate({
      path: 'vehicle',
      populate: { path: 'vehicleType' },
    })
    .populate('driver')
    .populate('person')
    .populate({
      path: 'weighings.material',
      populate: {
        path: 'classification',
        populate: { path: 'materialType' },
      },
    });
}

async function getVisitById(visitId) {
  return await Visit.findById(visitId)
    .populate({
      path: 'vehicle',
      populate: { path: 'vehicleType' },
    })
    .populate('driver')
    .populate('person')
    .populate({
      path: 'weighings.material',
      populate: {
        path: 'classification',
        populate: { path: 'materialType' },
      },
    });
}

module.exports = {
  createVisit,
  addWeighing,
  completeWeighing,
  closeVisit,
  getOpenVisits,
  getAllVisits,
  getVisitById,
};

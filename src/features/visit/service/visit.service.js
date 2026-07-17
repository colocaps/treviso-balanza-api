const Visit = require('../model/visit');

const basePopulation = [
  {
    path: 'vehicle',
    populate: { path: 'vehicleType' },
  },
  { path: 'driver' },
  { path: 'person' },
  {
    path: 'weighings.material',
    populate: {
      path: 'classification',
      populate: { path: 'materialType' },
    },
  },
  {
    path: 'user',
    select: 'name lastname company',
    populate: {
      path: 'company',
      select: 'name', // ajustá los campos que quieras traer de la empresa
    },
  },
];

async function createVisit({
  vehicleId,
  driverId,
  personId,
  operationType,
  details,
}) {
  // Auto-increment: find the highest visitNumber and add 1.
  const last = await Visit.findOne({}, { visitNumber: 1 })
    .sort({ visitNumber: -1 })
    .lean();
  const visitNumber = (last?.visitNumber ?? 0) + 1;

  const visit = await Visit.create({
    vehicle: vehicleId,
    driver: driverId,
    person: personId,
    operationType,
    entryDate: new Date(),
    isClosed: false,
    weighings: [],
    details,
    visitNumber,
  });

  return await Visit.findById(visit._id).populate(basePopulation);
}

async function addWeighing(visitId, { materialId, weight }) {
  const visit = await Visit.findById(visitId);
  if (!visit) throw new Error('Visita no encontrada');

  if (typeof weight !== 'number' || weight <= 0) {
    throw new Error('Peso inválido, debe ser un número positivo');
  }

  const lastWeighing = visit.weighings?.[visit.weighings.length - 1];

  if (lastWeighing) {
    if (
      lastWeighing.grossWeight === 0 ||
      lastWeighing.tareWeight === 0 ||
      lastWeighing.netWeight === 0
    ) {
      throw new Error('Ya no se puede registrar peso, el último pesaje fue 0');
    }

    if (visit.operationType === 'IN') {
      // Ordering constraint only applies before the first closing (main weighing).
      // Sub-weighings (added after the main weighing is closed) are exempt so
      // they can carry any positive gross regardless of the main tare value.
      const hasClosedWeighing = visit.weighings.some((w) => w.isClosed);
      if (
        !hasClosedWeighing &&
        lastWeighing?.tareWeight != null &&
        weight > lastWeighing.tareWeight
      ) {
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
  }
  // Validación: visita debe estar abierta
  if (visit.isClosed) {
    throw new Error('No se puede agregar un pesaje a una visita cerrada');
  }
  if (weight <= 0) {
    throw new Error('No se puede pesar por debajo de 0');
  }

  // Validación: no permitir agregar otro weighing si hay alguno abierto
  if (visit.weighings.some((w) => !w.isClosed)) {
    throw new Error(
      'No se puede agregar un nuevo pesaje hasta que el anterior esté cerrado',
    );
  }

  visit.weighings.push({
    material: materialId,
    isClosed: false,
    ...(visit.operationType === 'IN'
      ? { grossWeight: weight }
      : { tareWeight: weight }),
  });

  await visit.save();
  return await Visit.findById(visit._id).populate(basePopulation);
}
async function completeWeighing(visitId, weighingId, weight) {
  if (typeof weight !== 'number' || weight <= 0) {
    throw new Error('Peso inválido, debe ser un número positivo');
  }

  const visit = await Visit.findById(visitId);
  if (!visit) throw new Error('Visita no encontrada');

  if (visit.isClosed) {
    throw new Error('No se puede completar un pesaje de una visita cerrada');
  }

  const weighing = visit.weighings.id(weighingId);
  if (!weighing) throw new Error('Pesaje no encontrado');

  if (weighing.isClosed) throw new Error('El pesaje ya está cerrado');

  const isIncome = visit.operationType === 'IN';

  // Determinar qué peso se está ingresando y calcular el potencial peso neto
  let potentialGrossWeight, potentialTareWeight;

  if (isIncome) {
    // En operación de entrada, se ingresa la tara
    if (weighing.tareWeight != null) {
      throw new Error('La tara ya fue registrada para este pesaje');
    }
    potentialGrossWeight = weighing.grossWeight;
    potentialTareWeight = weight;
  } else {
    // En operación de salida, se ingresa el peso bruto
    if (weighing.grossWeight != null) {
      throw new Error('El peso bruto ya fue registrado para este pesaje');
    }
    potentialGrossWeight = weight;
    potentialTareWeight = weighing.tareWeight;
  }

  const lastWeighing = visit.weighings?.[visit.weighings.length - 1];

  if (lastWeighing) {
    if (
      lastWeighing.grossWeight === 0 ||
      lastWeighing.tareWeight === 0 ||
      lastWeighing.netWeight === 0
    ) {
      throw new Error('Ya no se puede registrar peso, el último pesaje fue 0');
    }

    if (isIncome) {
      if (
        lastWeighing?.tareWeight != null &&
        potentialGrossWeight > lastWeighing.tareWeight
      ) {
        throw new Error(
          'El peso bruto no puede ser mayor a la última tara registrada',
        );
      }
    } else {
      if (
        lastWeighing?.grossWeight != null &&
        potentialTareWeight < lastWeighing.grossWeight
      ) {
        throw new Error(
          'La tara no puede ser menor al último peso bruto registrado',
        );
      }
    }
  }

  // VALIDACIÓN CRÍTICA: Verificar que el peso neto no sea negativo ANTES de asignar
  if (potentialGrossWeight != null && potentialTareWeight != null) {
    const potentialNetWeight = potentialGrossWeight - potentialTareWeight;
    if (potentialNetWeight < 0) {
      throw new Error(
        `El peso neto resultante sería negativo (${potentialNetWeight}). ` +
          `Peso bruto: ${potentialGrossWeight}, Tara: ${potentialTareWeight}`,
      );
    }
  }

  // Asignar los valores DESPUÉS de todas las validaciones
  if (isIncome) {
    weighing.tareWeight = weight;
  } else {
    weighing.grossWeight = weight;
  }

  // Calcular neto si ambos pesos existen
  if (weighing.grossWeight != null && weighing.tareWeight != null) {
    weighing.netWeight = weighing.grossWeight - weighing.tareWeight;
  }

  // Cerrar pesaje si neto ya está calculado
  if (weighing.netWeight != null) {
    weighing.isClosed = true;
  }

  await visit.save();
  return await Visit.findById(visitId).populate(basePopulation);
}
async function closeVisit(visitId, details, userId, companyId) {
  const visit = await Visit.findById(visitId);
  if (!visit) throw new Error('Visita no encontrada');

  if (visit.isClosed) {
    throw new Error('La visita ya está cerrada');
  }

  const allWeighingsClosed = visit.weighings.every((w) => w.isClosed);
  if (!allWeighingsClosed) {
    throw new Error('No se puede cerrar la visita: hay pesajes sin finalizar');
  }

  // The main (first) weighing's gross/tare/net represent the real truck weight.
  // Sub-weighings only subdivide the net — they don't change the total weight.
  const mainWeighing = visit.weighings[0];
  visit.totalGrossWeight = mainWeighing?.grossWeight || 0;
  visit.totalTareWeight = mainWeighing?.tareWeight || 0;
  visit.totalNetWeight  = mainWeighing?.netWeight  || 0;

  visit.isClosed = true;
  visit.exitDate = new Date();

  // 🧑 Asociar usuario que cerró la visita
  visit.user = userId;

  // 🏢 Si querés guardar la empresa también en la visita, podrías hacer esto:
  // visit.company = companyId;

  if (details) {
    visit.details = details;
  }

  await visit.save();

  return await Visit.findById(visitId).populate(basePopulation);
}

async function getOpenVisits() {
  return await Visit.find({ isClosed: false }).populate(basePopulation);
}

async function getAllVisits({ page = 1, limit = 10, startDate, endDate }) {
  const skip = (page - 1) * limit;
  const query = { isClosed: true };

  if (startDate || endDate) {
    query.entryDate = {};
    if (startDate) query.entryDate.$gte = new Date(startDate);
    if (endDate) {
      // sumo 1 día para que incluya toda la fecha endDate
      query.entryDate.$lt = new Date(
        new Date(endDate).getTime() + 24 * 60 * 60 * 1000,
      );
    }
  }

  const [visits, total] = await Promise.all([
    Visit.find(query).populate(basePopulation).skip(skip).limit(limit),
    Visit.countDocuments(query),
  ]);

  return { visits, total };
}

async function getVisitById(visitId) {
  return await Visit.findById(visitId).populate(basePopulation);
}

async function deleteVisit(visitId) {
  const visit = await Visit.findById(visitId);
  if (!visit) {
    const err = new Error('Visita no encontrada');
    err.statusCode = 404;
    throw err;
  }
  await Visit.findByIdAndDelete(visitId);
  return { message: 'Visita eliminada correctamente' };
}

async function updateVisitDate(visitId, entryDate) {
  const visit = await Visit.findById(visitId);
  if (!visit) {
    const err = new Error('Visita no encontrada');
    err.statusCode = 404;
    throw err;
  }

  const date = new Date(entryDate);
  if (isNaN(date.getTime())) {
    const err = new Error('Fecha inválida');
    err.statusCode = 400;
    throw err;
  }

  visit.entryDate = date;
  await visit.save();
  return await Visit.findById(visitId).populate(basePopulation);
}

async function deleteWeighing(visitId, weighingId) {
  const visit = await Visit.findById(visitId);
  if (!visit) {
    const err = new Error('Visita no encontrada');
    err.statusCode = 404;
    throw err;
  }

  if (visit.isClosed) {
    const err = new Error('No se puede modificar una visita cerrada');
    err.statusCode = 400;
    throw err;
  }

  const weighingIndex = visit.weighings.findIndex(
    (w) => w._id.toString() === weighingId,
  );
  if (weighingIndex === -1) {
    const err = new Error('Pesaje no encontrado');
    err.statusCode = 404;
    throw err;
  }

  if (weighingIndex === 0) {
    const err = new Error('No se puede eliminar el pesaje principal de la visita');
    err.statusCode = 400;
    throw err;
  }

  visit.weighings.splice(weighingIndex, 1);
  await visit.save();
  return await Visit.findById(visitId).populate(basePopulation);
}

module.exports = {
  createVisit,
  addWeighing,
  completeWeighing,
  closeVisit,
  getOpenVisits,
  getAllVisits,
  getVisitById,
  deleteVisit,
  deleteWeighing,
  updateVisitDate,
};

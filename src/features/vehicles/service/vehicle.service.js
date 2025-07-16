// service/vehicle-service.js
const Vehicle = require('../model/vehicle');
const VehicleType = require('../model/vehicle-type');

function normalizePlate(plate) {
  return plate.replace(/\s+/g, '').toUpperCase();
}

async function createVehicleType(name) {
  const existing = await VehicleType.findOne({
    name: { $regex: new RegExp(`^${name}$`, 'i') },
  });
  if (existing) {
    if (existing.isActive)
      throw new Error('Ya existe un tipo de vehículo activo con ese nombre');
    existing.isActive = true;
    await existing.save();
    return existing;
  }
  return VehicleType.create({ name });
}

async function getAllVehicleTypes() {
  return VehicleType.find({ isActive: true });
}

async function createVehicle({ brand, model, plate, vehicleTypeId }) {
  const normalizedPlate = normalizePlate(plate);

  const existing = await Vehicle.findOne({ plate: normalizedPlate });
  if (existing) {
    if (existing.isActive)
      throw new Error('Ya existe un vehículo activo con esa patente');
    existing.isActive = true;
    existing.brand = brand;
    existing.model = model;
    existing.vehicleType = vehicleTypeId;

    await existing.save();
    return existing;
  }
  return Vehicle.create({
    brand,
    model,
    plate: normalizedPlate,
    vehicleType: vehicleTypeId,
  });
}

async function getAllVehicles() {
  return Vehicle.find({ isActive: true }).populate('vehicleType');
}

async function updateVehicle(id, { brand, model, plate, vehicleTypeId }) {
  const normalizedPlate = normalizePlate(plate);

  const vehicle = await Vehicle.findById(id);
  if (!vehicle) throw new Error('Vehículo no encontrado');

  if (vehicle.plate !== normalizedPlate) {
    const existing = await Vehicle.findOne({
      plate: normalizedPlate,
      isActive: true,
    });
    if (existing)
      throw new Error('Ya existe un vehículo activo con esa patente');
    vehicle.plate = normalizedPlate;
  }

  if (brand) vehicle.brand = brand;
  if (model) vehicle.model = model;
  if (vehicleTypeId) vehicle.vehicleType = vehicleTypeId;

  await vehicle.save();

  return vehicle;
}

async function toggleVehicleActive(id) {
  const vehicle = await Vehicle.findById(id);
  if (!vehicle) throw new Error('Vehículo no encontrado');
  vehicle.isActive = !vehicle.isActive;
  await vehicle.save();
  return vehicle;
}

async function updateVehicleType(id, name) {
  const existing = await VehicleType.findOne({
    name: name.toUpperCase(),
    isActive: true,
  });
  if (existing && existing._id.toString() !== id) {
    throw new Error('Ya existe un tipo de vehículo con ese nombre');
  }

  return await VehicleType.findByIdAndUpdate(
    id,
    { name: name.toUpperCase() },
    { new: true },
  );
}

async function toggleVehicleTypeActive(id) {
  const type = await VehicleType.findById(id);
  if (!type) throw new Error('Tipo de vehículo no encontrado');
  type.isActive = !type.isActive;
  await type.save();
  return type;
}

module.exports = {
  createVehicleType,
  getAllVehicleTypes,
  createVehicle,
  getAllVehicles,
  updateVehicle,
  toggleVehicleActive,
  updateVehicleType,
  toggleVehicleTypeActive,
};

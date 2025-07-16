// models/vehicle-type.js
const mongoose = require('mongoose');

const vehicleTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g. 'camion', 'pickup', 'camioneta', 'semi acoplado'
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('VehicleType', vehicleTypeSchema);

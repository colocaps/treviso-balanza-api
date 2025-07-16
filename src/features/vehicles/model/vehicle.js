// models/vehicle.js
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  brand: { type: String, required: true }, // e.g. 'Ford'
  model: { type: String, required: true }, // e.g. 'F100'
  plate: { type: String, required: true, unique: true }, // patente única
  vehicleType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VehicleType',
    required: true,
  },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('Vehicle', vehicleSchema);

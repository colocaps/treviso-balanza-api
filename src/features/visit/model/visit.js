const mongoose = require('mongoose');

const weighingSchema = new mongoose.Schema({
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
    required: true,
  },
  grossWeight: { type: Number },
  tareWeight: { type: Number },
  netWeight: { type: Number },
  isClosed: { type: Boolean, default: false },
});

const visitSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person',
    required: true,
  },
  person: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person',
    required: true,
  }, // Proveedor o Cliente
  operationType: { type: String, enum: ['IN', 'OUT'], required: true }, // Entrada o Salida de materiales

  weighings: [weighingSchema],

  totalGrossWeight: { type: Number, default: 0 },
  totalTareWeight: { type: Number, default: 0 },
  totalNetWeight: { type: Number, default: 0 },

  entryDate: { type: Date, default: Date.now },
  exitDate: { type: Date },

  isClosed: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  details: { type: String },
});

module.exports = mongoose.model('Visit', visitSchema);

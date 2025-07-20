const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  cuit: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true }, // Código único para ingresar a la empresa
  socialReason: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  logo: { type: String },
});

module.exports = mongoose.model('Company', companySchema);

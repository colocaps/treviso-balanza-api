const mongoose = require('mongoose');

const materialTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // ejemplo: 'Metal', 'Madera'
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('MaterialType', materialTypeSchema);

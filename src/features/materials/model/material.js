const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  name: { type: String, required: true }, // ejemplo: 'Hierro', 'Roble'
  classification: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MaterialClassification',
    required: true,
  },
  isActive: { type: Boolean, default: true },
});

const Material = mongoose.model('Material', materialSchema);
module.exports = Material;

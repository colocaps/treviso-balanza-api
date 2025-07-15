const mongoose = require('mongoose');

const materialClassificationSchema = new mongoose.Schema({
  name: { type: String, required: true }, // ejemplo: 'Duro', 'Blando', 'Chapa'
  materialType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MaterialType',
    required: true,
  },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model(
  'MaterialClassification',
  materialClassificationSchema,
);

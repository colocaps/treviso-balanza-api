// models/profile.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  permissions: [{ type: String }],
});

module.exports = mongoose.model('Profile', profileSchema);

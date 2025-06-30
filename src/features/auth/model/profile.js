// models/profile.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // ej: "admin", "user"
  permissions: [{ type: String }], // ej: ["create", "edit", "delete"]
});

module.exports = mongoose.model('Profile', profileSchema);

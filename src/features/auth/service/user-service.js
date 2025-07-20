const User = require('../model/user');
require('../model/profile');

async function getAllUsers(companyId) {
  return await User.find({ company: companyId }).populate('profile');
}

async function getUserById(id) {
  return await User.findById(id).populate('profile');
}

async function getUserByUid(uid) {
  return await User.findOne({ uid }).populate('profile');
}

async function getUserByEmail(email) {
  return await User.findOne({ email }).populate('profile');
}

/**
 * Crea un usuario nuevo si no existe, usando el uid de Firebase
 * @param {Object} firebaseUserData - Datos del usuario desde Firebase
 * @param {Object} additionalData - Datos adicionales desde el frontend (name, lastname, dni, profile, companyId)
 */
async function createUserIfNotExists(firebaseUserData, additionalData) {
  const { uid, email } = firebaseUserData;
  const { name, lastname, dni, profile, companyId } = additionalData;

  const existingUser = await User.findOne({ uid });
  if (existingUser) return existingUser;

  const newUser = new User({
    uid,
    email,
    name,
    lastname,
    dni,
    profile,
    company: companyId, // <-- Asociamos el usuario a la empresa
  });

  await newUser.save();
  return newUser;
}

module.exports = {
  getAllUsers,
  createUserIfNotExists,
  getUserById,
  getUserByUid,
  getUserByEmail,
};

const User = require('../model/user');

async function getAllUsers() {
  return await User.find({});
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
 * @param {Object} additionalData - Datos adicionales desde el frontend (name, lastname, dni, profile)
 */
async function createUserIfNotExists(firebaseUserData, additionalData) {
  const { uid, email } = firebaseUserData;
  const { name, lastname, dni, profile } = additionalData;

  // Verificar si ya existe
  const existingUser = await User.findOne({ uid });
  if (existingUser) return existingUser;

  // Crear nuevo
  const newUser = new User({
    uid,
    email,
    name,
    lastname,
    dni,
    profile,
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

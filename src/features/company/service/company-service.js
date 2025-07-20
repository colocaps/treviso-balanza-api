const Company = require('../model/company.model');

// Generar un código único aleatorio de 6 caracteres alfanuméricos
async function generateUniqueCode() {
  let code;
  let exists = true;

  while (exists) {
    code = Math.random().toString(36).substring(2, 8).toUpperCase(); // ej: 'A1B2C3'
    exists = await Company.exists({ code });
  }

  return code;
}

async function getCompanyByCode(code) {
  const company = await Company.findOne({ code });
  if (!company) throw new Error('Compañía no encontrada');
  return company;
}
// Crear nueva compañía
async function createCompany({ name, cuit, socialReason, logo }) {
  const existing = await Company.findOne({ cuit });
  if (existing) {
    throw new Error('Ya existe una empresa con ese CUIT');
  }

  const code = await generateUniqueCode();

  const company = new Company({
    name,
    cuit,
    socialReason,
    logo,
    code,
  });

  await company.save();
  return company;
}

// Editar compañía
async function updateCompany(companyId, updates) {
  const company = await Company.findById(companyId);
  if (!company) throw new Error('Compañía no encontrada');

  if (updates.cuit) {
    const existing = await Company.findOne({
      cuit: updates.cuit,
      _id: { $ne: companyId }, // evita que se compare consigo mismo
    });

    if (existing) {
      throw new Error('Ya existe una empresa con ese CUIT');
    }

    company.cuit = updates.cuit;
  }

  if (updates.name) company.name = updates.name;
  if (updates.socialReason) company.socialReason = updates.socialReason;
  if (updates.logo) company.logo = updates.logo;
  if (updates.address) company.address = updates.address;
  if (updates.phoneNumber) company.phoneNumber = updates.phoneNumber;
  if (updates.email) company.email = updates.email;

  await company.save();
  return company;
}

// Soft delete (desactivar)
async function deactivateCompany(companyId) {
  const company = await Company.findById(companyId);
  if (!company) throw new Error('Compañía no encontrada');

  company.isActive = false;
  await company.save();
  return company;
}

async function activateCompany(companyId) {
  const company = await Company.findById(companyId);
  if (!company) throw new Error('Compañía no encontrada');

  company.isActive = true;
  await company.save();
  return company;
}

// Listar todas las compañías activas
async function getAllCompanies() {
  return Company.find({ isActive: true });
}

module.exports = {
  createCompany,
  updateCompany,
  deactivateCompany,
  getAllCompanies,
  getCompanyByCode,
  activateCompany,
};

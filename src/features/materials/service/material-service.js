const MaterialType = require('../model/material-type');
const MaterialClassification = require('../model/material-classification');
const Material = require('../model/material');

async function createMaterialType(name) {
  const existingType = await MaterialType.findOne({
    name: { $regex: new RegExp(`^${name}$`, 'i') },
  });

  if (existingType) {
    if (existingType.isActive) {
      throw new Error('Ya existe un tipo de material activo con ese nombre');
    } else {
      existingType.isActive = true;
      await existingType.save();
      return existingType;
    }
  }

  return await MaterialType.create({ name });
}

async function createMaterialClassification(name, materialTypeId) {
  const existingClassification = await MaterialClassification.findOne({
    name: { $regex: new RegExp(`^${name}$`, 'i') },
    materialType: materialTypeId,
  });

  if (existingClassification) {
    if (existingClassification.isActive) {
      throw new Error(
        'Ya existe una clasificación activa con ese nombre para ese tipo de material',
      );
    } else {
      existingClassification.isActive = true;
      await existingClassification.save();
      return await MaterialClassification.findById(
        existingClassification._id,
      ).populate('materialType');
    }
  }

  const newClassification = await MaterialClassification.create({
    name,
    materialType: materialTypeId,
  });

  return await MaterialClassification.findById(newClassification._id).populate(
    'materialType',
  );
}

async function createMaterial(name, classificationId) {
  // Buscamos material con ese nombre, sin importar mayúsculas/minúsculas
  const existingMaterial = await Material.findOne({
    name: { $regex: new RegExp(`^${name}$`, 'i') },
  });

  if (existingMaterial) {
    if (existingMaterial.isActive) {
      throw new Error('Ya existe un material activo con ese nombre');
    } else {
      existingMaterial.isActive = true;
      existingMaterial.classification = classificationId;
      await existingMaterial.save();
      return await Material.findById(existingMaterial._id).populate({
        path: 'classification',
        populate: {
          path: 'materialType',
        },
      });
    }
  }

  // Si no existe, creamos uno nuevo
  const newMaterial = await Material.create({
    name,
    classification: classificationId,
  });

  // <-- AQUI EL FALTANTE: devolver el material creado populado
  return await Material.findById(newMaterial._id).populate({
    path: 'classification',
    populate: {
      path: 'materialType',
    },
  });
}

async function getAllMaterialTypes() {
  return await MaterialType.find({ isActive: true });
}

async function getAllMaterialClassifications() {
  return await MaterialClassification.find({ isActive: true }).populate(
    'materialType',
  );
}

async function getAllMaterials() {
  return await Material.find().populate({
    path: 'classification',
    populate: {
      path: 'materialType',
    },
  });
}

async function updateMaterialClassification(id, updateData) {
  const updateFields = {};

  if (updateData.name) {
    updateFields.name = updateData.name;
  }

  if (updateData.materialTypeId) {
    // Opcional: podés validar que el materialTypeId exista antes de asignarlo
    const materialTypeExists = await MaterialType.findById(
      updateData.materialTypeId,
    );
    if (!materialTypeExists) {
      throw new Error('Tipo de material no encontrado');
    }
    updateFields.materialType = updateData.materialTypeId;
  }

  // Actualizamos con los campos que llegaron
  await MaterialClassification.findByIdAndUpdate(id, updateFields);

  // Buscamos y devolvemos el documento actualizado con populate
  return await MaterialClassification.findById(id).populate('materialType');
}

async function toggleMaterialClassificationActive(id) {
  // Validar que no existan materiales asociados
  const count = await Material.countDocuments({ classification: id });
  if (count > 0) {
    throw new Error(
      'No se puede desactivar, hay materiales asociados a esta clasificación',
    );
  }

  let classification = await MaterialClassification.findById(id);
  if (!classification) throw new Error('Clasificación no encontrada');

  classification.isActive = !classification.isActive;
  await classification.save();

  // Volver a buscar con populate
  classification = await MaterialClassification.findById(id).populate(
    'materialType',
  );

  return classification;
}

async function updateMaterialType(id, name) {
  return await MaterialType.findByIdAndUpdate(id, { name }, { new: true });
}

async function toggleMaterialTypeActive(id) {
  // Validar que no existan clasificaciones asociadas
  const count = await MaterialClassification.countDocuments({
    materialType: id,
  });
  if (count > 0) {
    throw new Error(
      'No se puede desactivar, hay clasificaciones asociadas a este tipo de material',
    );
  }

  const type = await MaterialType.findById(id);
  if (!type) throw new Error('Tipo de material no encontrado');

  type.isActive = !type.isActive;
  await type.save();
  return type;
}

async function toggleMaterialActive(id) {
  const material = await Material.findById(id);
  if (!material) throw new Error('Material no encontrado');

  material.isActive = !material.isActive;
  await material.save();

  return await Material.findById(material._id).populate({
    path: 'classification',
    populate: { path: 'materialType' },
  });
}

async function updateMaterial(materialId, updateData) {
  const material = await Material.findById(materialId);
  if (!material) {
    throw new Error('Material no encontrado');
  }

  if (updateData.name) {
    material.name = updateData.name;
  }

  if (updateData.classificationId) {
    const classification = await MaterialClassification.findById(
      updateData.classificationId,
    );
    if (!classification) {
      throw new Error('Clasificación inválida');
    }
    material.classification = updateData.classificationId;
  }

  if (typeof updateData.isActive === 'boolean') {
    material.isActive = updateData.isActive;
  }

  await material.save();

  return await Material.findById(material._id).populate({
    path: 'classification',
    populate: { path: 'materialType' },
  });
}

module.exports = {
  createMaterialType,
  createMaterialClassification,
  createMaterial,
  getAllMaterials,
  updateMaterialClassification,
  toggleMaterialClassificationActive,
  updateMaterialType,
  toggleMaterialTypeActive,
  getAllMaterialTypes,
  getAllMaterialClassifications,
  updateMaterial,
  toggleMaterialActive,
};

require('dotenv').config();
const mongoose = require('mongoose');
const Profile = require('../model/profile');

async function seedProfiles() {
  // Conectarse primero
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const profiles = [
    {
      name: 'admin',
      permissions: ['create', 'edit', 'delete', 'view', 'manage-users'],
    },
    {
      name: 'encargado',
      permissions: ['create', 'edit', 'view'],
    },
    {
      name: 'operador',
      permissions: ['view'],
    },
  ];

  for (const profile of profiles) {
    const exists = await Profile.findOne({ name: profile.name });
    if (!exists) {
      await Profile.create(profile);
      console.log(`✅ Perfil creado: ${profile.name}`);
    } else {
      console.log(`ℹ️ Perfil ya existe: ${profile.name}`);
    }
  }

  await mongoose.disconnect();
  console.log('🔌 Desconectado de MongoDB');
}

seedProfiles()
  .then(() => process.exit())
  .catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
  });

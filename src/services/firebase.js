// plugins/firebase.js
const fp = require('fastify-plugin');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

let serviceAccount;

// Definimos el entorno desde ENVIRONMENT o fallback a 'local'
const environment = process.env.ENVIRONMENT || 'local';

// 🔁 Determinar archivo de servicio
if (environment === 'production' || environment === 'development') {
  // En Render: usar el Secret File correspondiente montado en /etc/secrets
  const secretPath = `/etc/secrets/firebase-service-account-${environment}.json`;
  serviceAccount = JSON.parse(fs.readFileSync(secretPath, 'utf8'));
} else {
  // En local: usar el archivo de desarrollo
  const localPath = path.join(
    __dirname,
    '../../secrets/firebase-service-account-development.json',
  );
  serviceAccount = require(localPath);
}

const firebasePlugin = async function (fastify, opts) {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  fastify.decorate('firebaseAdmin', admin);
};

module.exports = fp(firebasePlugin);

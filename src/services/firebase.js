// plugins/firebase.js
const fp = require('fastify-plugin');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

let serviceAccount;

if (process.env.NODE_ENV === 'production') {
  // En Render (o producción), usar Secret File montado en /etc/secrets
  const secretPath = '/etc/secrets/firebase-service-account.json';
  serviceAccount = JSON.parse(fs.readFileSync(secretPath, 'utf8'));
} else {
  // En local, usar archivo en carpeta secrets
  const localPath = path.join(
    __dirname,
    '../../secrets/firebase-service-account.json',
  );
  serviceAccount = require(localPath);
}

const firebasePlugin = async function (fastify, opts) {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  // Exponé admin como propiedad de fastify
  fastify.decorate('firebaseAdmin', admin);
};

module.exports = fp(firebasePlugin);

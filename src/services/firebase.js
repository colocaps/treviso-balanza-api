// plugins/firebase.js
const fp = require('fastify-plugin');
const admin = require('firebase-admin');
const serviceAccount = require('../../secrets/firebase-service-account.json');

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

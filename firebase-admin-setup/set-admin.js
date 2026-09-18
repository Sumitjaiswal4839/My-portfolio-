const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const serviceAccount = require('./serviceAccountKey.json');
const USER_UID = 'ERwKx0TjaEWVeI7WA9D81g0yKME2';

initializeApp({
  credential: cert(serviceAccount)
});

getAuth().setCustomUserClaims(USER_UID, { admin: true })
  .then(() => {
    console.log(`Success! Admin claim has been set for user ${USER_UID}.`);
    console.log('You can now log in to the portfolio admin panel.');
  })
  .catch((error) => {
    console.error('Error setting custom claim:', error);
  });

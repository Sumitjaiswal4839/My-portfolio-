const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const serviceAccount = require('./serviceAccountKey.json');
const email = 'sj0269950@gmail.com'; // Aapka Admin Email

initializeApp({
  credential: cert(serviceAccount)
});

getAuth().generateEmailVerificationLink(email)
  .then((link) => {
    console.log("==================================================");
    console.log("Success! Apni email verify karne ke liye neeche diye gaye link ko browser me open karein:");
    console.log("\n🔗 Link:", link, "\n");
    console.log("==================================================");
  })
  .catch((error) => {
    console.error("Error generating link:", error);
  });

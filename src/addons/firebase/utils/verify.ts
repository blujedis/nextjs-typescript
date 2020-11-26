import admin from 'firebase-admin';

export const verifyIdToken = (token) => {
  
  let FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY;

  if (!FIREBASE_PRIVATE_KEY)
    throw new Error(`Token verification requires a private key.`);

  // https://stackoverflow.com/a/41044630/1332513
  FIREBASE_PRIVATE_KEY = FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');

  if (!admin.apps.length) {

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY,
      }),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });

  }

  return admin
    .auth()
    .verifyIdToken(token)
    .catch((error) => {
      throw error
    });
    
}
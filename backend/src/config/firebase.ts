import * as admin from "firebase-admin";
import "dotenv/config";

if (!admin.apps.length) {
  const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountEnv) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT env var is missing. Add it to backend/.env",
    );
  }
  const serviceAccount = JSON.parse(serviceAccountEnv);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

export { admin };
export const db = admin.firestore();
export const auth = admin.auth();
export const messaging = admin.messaging();

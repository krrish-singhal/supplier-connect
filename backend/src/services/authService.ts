import { db, admin } from "../config/firebase";

const DEV_OTP = "123456";

export const sendOtp = async (mobile: string): Promise<void> => {
  // Delete any existing session for this mobile
  const existing = await db
    .collection("otp_sessions")
    .where("mobile", "==", mobile)
    .get();
  const batch = db.batch();
  existing.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();

  // Create new session
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 5 * 60 * 1000);
  await db.collection("otp_sessions").add({
    mobile,
    otp: DEV_OTP,
    expires_at: expiresAt.toISOString(),
    created_at: now.toISOString(),
  });
};

export const verifyOtp = async (mobile: string, otp: string) => {
  const snapshot = await db
    .collection("otp_sessions")
    .where("mobile", "==", mobile)
    .limit(1)
    .get();

  if (snapshot.empty) {
    throw new Error("OTP not found. Request a new one.");
  }

  const sessionDoc = snapshot.docs[0];
  const session = sessionDoc.data();

  if (new Date(session.expires_at) < new Date()) {
    await sessionDoc.ref.delete();
    throw new Error("OTP expired");
  }

  if (session.otp !== DEV_OTP) {
    throw new Error("Invalid OTP");
  }

  // Consume session
  await sessionDoc.ref.delete();

  // Check if user exists
  const usersSnap = await db
    .collection("users")
    .where("mobile", "==", mobile)
    .limit(1)
    .get();
  const isNewUser = usersSnap.empty;

  if (!isNewUser) {
    const user = { id: usersSnap.docs[0].id, ...usersSnap.docs[0].data() };
    const token = await admin.auth().createCustomToken(user.id);
    return { token, isNewUser: false, user };
  }

  // Create Firebase Auth user for new user
  let firebaseUser;
  try {
    firebaseUser = await admin.auth().getUserByPhoneNumber(mobile);
  } catch {
    firebaseUser = await admin.auth().createUser({ phoneNumber: mobile });
  }

  const token = await admin.auth().createCustomToken(firebaseUser.uid);
  return { token, isNewUser: true, user: null };
};

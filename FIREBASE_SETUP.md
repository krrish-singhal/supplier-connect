# Firebase Setup Guide

This guide walks you through creating a Firebase project and obtaining the credentials required for SupplierConnect.

---

## Prerequisites

- A Google account
- Node.js installed

---

## Step 1 — Create a Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"**
3. Enter a project name (e.g. `supplier-connect`)
4. Choose whether to enable Google Analytics (optional), then click **"Create project"**
5. Wait for the project to be provisioned, then click **"Continue"**

---

## Step 2 — Register a Web App

1. From the project overview page, click the **Web** icon (`</>`) under *"Get started by adding Firebase to your app"*
2. Enter an app nickname (e.g. `SupplierConnect Web`)
3. Leave *"Also set up Firebase Hosting"* unchecked unless needed
4. Click **"Register app"**
5. Firebase will display a `firebaseConfig` object — keep this page open, you'll need the values in the next step

---

## Step 3 — Copy Your Credentials

From the `firebaseConfig` object shown after registration, map the values to your `.env` file:

```js
const firebaseConfig = {
  apiKey: "...",              // → EXPO_PUBLIC_FIREBASE_API_KEY
  authDomain: "...",          // → EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
  projectId: "...",           // → EXPO_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: "...",       // → EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "...",   // → EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: "...",               // → EXPO_PUBLIC_FIREBASE_APP_ID
};
```

---

## Step 4 — Create Your `.env` File

1. In the root of the project, copy the example file:

   ```bash
   cp .env.example .env
   ```

2. Open `.env` and replace the placeholder values with your actual Firebase credentials:

   ```env
   # Firebase Web SDK (for Expo)
   EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
   EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123...

   # Backend API URL
   EXPO_PUBLIC_API_URL=http://localhost:3001/api
   ```

> **Note:** If you missed the config screen, you can always find it again at:
> Firebase Console → Project Settings (gear icon) → **"Your apps"** → SDK setup and configuration

---

## Step 5 — Enable Authentication

1. In the Firebase Console sidebar, go to **Build → Authentication**
2. Click **"Get started"**
3. Under the **"Sign-in method"** tab, enable the providers your app uses:
   - **Phone** — for OTP-based login (used in SupplierConnect)
   - **Email/Password** — optional
4. Click **Save** on each provider you enable

---

## Step 5a — OTP Setup: Development Mode (Test Phone Numbers)

During development, Firebase lets you whitelist fake phone numbers so you don't consume SMS quota or need a real SIM.

1. In the Firebase Console go to **Build → Authentication**
2. Click the **"Sign-in method"** tab
3. Scroll down to **"Phone numbers for testing"**
4. Click **"Add phone number"**
5. Add entries using this pattern — any 10-digit number with a fixed OTP of `123456`:

   | Phone number      | Verification code |
   |-------------------|-------------------|
   | +1 1234567890     | 123456            |
   | +1 9876543210     | 123456            |
   | +91 9000000001    | 123456            |
   | *(add more as needed)* | 123456       |

6. Click **Save**

> These numbers bypass real SMS entirely. Any 10-digit number you add here will always accept `123456` as the OTP during testing.

**In your app code**, no changes are needed — Firebase automatically uses the test credentials when the phone number matches a whitelisted entry.

---

## Step 5b — OTP Setup: Production Mode

For production, Firebase sends real SMS to users. Complete these steps before going live:

### 1. Upgrade to the Blaze (pay-as-you-go) plan

Firebase Phone Auth requires the **Blaze plan** to send SMS in production.

1. In the Firebase Console, click **"Upgrade"** at the bottom of the left sidebar
2. Select **Blaze**, add a billing account, and confirm

### 2. Add your app's SHA certificate fingerprints (Android)

Firebase uses SHA fingerprints to verify your Android app identity and suppress the reCAPTCHA challenge.

```bash
# Debug fingerprint (for development builds)
cd android && ./gradlew signingReport

# Or using keytool
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

1. Copy the **SHA-1** and **SHA-256** values
2. Go to Firebase Console → ⚙️ **Project Settings** → **General** → your Android app
3. Click **"Add fingerprint"** and paste both values

### 3. Enable App Check (recommended for production)

App Check prevents abuse of your Phone Auth quota:

1. Go to **Build → App Check**
2. Register your app with **Play Integrity** (Android) or **DeviceCheck** (iOS)
3. Click **Enforce** once confirmed working

### 4. Set SMS region restrictions (optional but recommended)

Limit which countries can receive OTPs to reduce abuse:

1. Go to **Build → Authentication → Settings** tab
2. Under **"SMS region policy"**, select **"Allowlist"**
3. Add only the country codes your app operates in (e.g. `IN` for India, `US` for US)

### 5. Remove test phone numbers before release

Before publishing to production:

1. Go back to **Build → Authentication → Sign-in method → Phone numbers for testing**
2. Delete all test entries added in Step 5a

---

## Step 6 — Enable Firestore (if needed)

1. Go to **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** for development (switch to production rules before going live)
4. Select a Firestore location closest to your users, then click **"Enable"**

---

## Step 7 — Enable Storage (if needed)

1. Go to **Build → Storage**
2. Click **"Get started"**
3. Accept the default security rules for development
4. Click **"Done"**

---

## Security Reminders

- **Never commit your `.env` file** — it is already listed in `.gitignore`
- The `EXPO_PUBLIC_` prefix makes these variables available in the Expo client bundle; do not use it for secret server-side keys
- For production, set these environment variables in your CI/CD platform (e.g. EAS Secrets, GitHub Actions secrets) instead of a `.env` file

---

## Where to Find Credentials Again

Firebase Console → ⚙️ **Project Settings** → **General** tab → scroll down to **"Your apps"**

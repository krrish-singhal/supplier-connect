# SupplierConnect — APK Build Guide

This guide walks you through building a production `.apk` file to send to your client for demo purposes.

---

## Prerequisites

Make sure these are installed on your machine:

```bash
node --version      # v18 or above
npm --version       # v9 or above
```

---

## Option A — EAS Build (Recommended, cloud build, no Android SDK needed)

EAS Build runs on Expo's servers. No local Android Studio/SDK required.

### Step 1 — Install EAS CLI

```bash
npm install -g eas-cli
```

### Step 2 — Log in to Expo account

```bash
eas login
```

> If you don't have an account: https://expo.dev/signup (free)

### Step 3 — Configure EAS in the project

```bash
cd /home/krrish/Desktop/SupplierConnect
eas build:configure
```

When prompted:

- Select **Android**
- Choose **APK** (not AAB) so the client can install directly without Play Store

This creates `eas.json`. If asked to create it, accept. The file should contain a `preview` profile like this (edit `eas.json` if it was auto-created):

```json
{
  "cli": {
    "version": ">= 9.0.0"
  },
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

### Step 4 — Build the APK

```bash
eas build --platform android --profile preview
```

- This uploads your code to Expo's servers and builds the APK.
- Takes ~5–15 minutes.
- When done it prints a **download URL** for the `.apk` file.
- Download the `.apk` and send to the client via WhatsApp, email, or Google Drive.

---

## Option B — Local Build (requires Android Studio)

Use this only if you have Android Studio installed with the Android SDK.

### Step 1 — Install Android Studio

Download from: https://developer.android.com/studio

Make sure `ANDROID_HOME` is set:

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Step 2 — Pre-build the native project

```bash
cd /home/krrish/Desktop/SupplierConnect
npx expo prebuild --platform android --clean
```

### Step 3 — Build the APK

```bash
cd android
./gradlew assembleRelease
```

The APK will be at:

```
android/app/build/outputs/apk/release/app-release.apk
```

Send this file to your client.

---

## Sending to Client

1. Upload the `.apk` to **Google Drive** or **WeTransfer**
2. Share the link with client
3. On their Android phone:
   - Open link → Download `.apk`
   - Go to **Settings → Security** → Enable **Install from unknown sources**
   - Open the downloaded `.apk` → Install

---

## Demo Flow (No backend needed)

The app is fully demo-ready without any backend server:

| Step                   | What to do                                                               |
| ---------------------- | ------------------------------------------------------------------------ |
| **Login**              | Enter any 10-digit mobile number → tap **Continue**                      |
| **OTP**                | Enter **`123456`** → app auto-verifies                                   |
| **Onboarding**         | Fill name + business name → choose region + categories → **Get Started** |
| **Home**               | Loads with real mock data — suppliers, opportunities, stats              |
| **Suppliers**          | Browse, search, filter by region/category                                |
| **Supplier Detail**    | Tap any supplier → view profile, ratings, contact info                   |
| **Opportunities**      | Browse open opportunities with budget range                              |
| **Opportunity Detail** | Tap any opportunity → view details, apply                                |
| **Profile**            | Shows user info, saved suppliers, inquiry history                        |

> All data is local mock data. No internet required for the demo.

---

## Quick Checklist Before Building

- [ ] Run `npx tsc --noEmit` — should print **0 errors**
- [ ] Test on Expo Go with `npx expo start` — all screens working
- [ ] `DEMO_MODE = true` in `src/constants/index.ts` ✅ (already set)
- [ ] Icon shows correctly in `app.json` ✅
- [ ] Splash screen set to icon with blue background ✅

---

## After the Demo

When ready to connect to real backend:

1. Set `export const DEMO_MODE = false;` in `src/constants/index.ts`
2. Set `EXPO_PUBLIC_API_URL=https://your-backend.com` in `.env`
3. Rebuild with `eas build --platform android --profile production`

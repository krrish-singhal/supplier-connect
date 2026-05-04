# SupplierConnect — Complete Test & Verification Guide

Use this document to verify every feature before the meeting.
Work top-to-bottom. Each section tells you exactly what to do and what to expect.

---

## PRE-FLIGHT: Start the Backend

```bash
# Terminal 1 — Backend
cd backend
cp .env.example .env
# Paste your Firebase service account JSON into .env as FIREBASE_SERVICE_ACCOUNT
npm run dev
# Expected: "SupplierConnect backend running on port 3000 in development mode"

# Terminal 2 — Frontend
cd ..   # project root
npx expo start
# Scan QR with Expo Go, or press 'a' for Android emulator / 'i' for iOS
```

### Health Check (do this first)
Open browser → `http://localhost:3000/health`
```json
Expected response:
{
  "status": "ok",
  "env": "development",
  "timestamp": "2026-05-03T..."
}
```
If this fails, the backend is not running — do not proceed.

---

## SECTION 1 — Firestore Seed Data

### Step 1.1 — Run the seed script
```bash
cd backend
npm run seed
```

**Expected terminal output:**
```
Seeding suppliers...
  ✓ ShriRam Packaging Co.
  ✓ Bharat Machinery Works
  ✓ Agarwal Textiles
  ✓ Delhi Electronics Hub
  ✓ Noida Furniture World
  ✓ Jaipur Industrial Goods
  ✓ Bangalore Chemicals Ltd
  ✓ Chennai Logistics Pro
  ✓ Kolkata Construction Co
  ✓ Patna Office Supplies

Seeding opportunities...
  ✓ New Township Construction Project
  ✓ Petrol Pump Dealership Opening
  ✓ Franchise Expansion Lead
  ✓ Government Tender Alert
  ✓ Warehouse Development Project

✅ Seed complete!
```

### Step 1.2 — Verify in Firebase Console
1. Go to Firebase Console → Firestore Database
2. Open `suppliers` collection
   - ✅ Should have **10 documents**
   - ✅ Each document has: `id`, `name`, `city`, `state`, `region`, `category`, `description`, `is_verified`, `logo_url`, `created_at`
   - ✅ `is_verified: true` on: ShriRam Packaging Co., Delhi Electronics Hub, Bangalore Chemicals Ltd
   - ✅ Regions present: West (3), North (3), South (2), East (2)
3. Open `opportunities` collection
   - ✅ Should have **5 documents**
   - ✅ Each document has: `id`, `title`, `city`, `category`, `description`, `cta_label`, `created_at`

---

## SECTION 2 — Backend API Tests (via curl or Postman)

### 2.1 — Auth: Send OTP
```bash
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile": "+919876543210"}'
```
**Expected:**
```json
{ "success": true, "message": "OTP sent (dev mode — use 123456)" }
```
**Verify in Firestore:** `otp_sessions` collection should have a new document with:
- `mobile: "+919876543210"`
- `otp: "123456"`
- `expires_at`: 5 minutes from now
- `created_at`: now

**Failure cases to test:**
```bash
# Missing mobile
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{}'
# Expected: { "success": false, "message": "Invalid mobile number..." } (status 400)

# Invalid format (no + prefix)
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile": "9876543210"}'
# Expected: { "success": false, "message": "Invalid mobile number..." } (status 400)
```

---

### 2.2 — Auth: Verify OTP (Wrong OTP)
```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile": "+919876543210", "otp": "999999"}'
```
**Expected:**
```json
{ "success": false, "message": "Invalid OTP" }
```

---

### 2.3 — Auth: Verify OTP (Correct OTP — New User)
```bash
# First send OTP again (previous one may be consumed)
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile": "+919876543210"}'

# Then verify
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile": "+919876543210", "otp": "123456"}'
```
**Expected (new user — number not in Firestore users):**
```json
{
  "success": true,
  "token": "<Firebase custom token>",
  "isNewUser": true,
  "user": null
}
```
**Verify in Firestore:** The `otp_sessions` document for this mobile should be **deleted** (consumed).

---

### 2.4 — Suppliers: List All
```bash
curl http://localhost:3000/api/suppliers
```
**Expected:**
```json
{
  "success": true,
  "suppliers": [ ... 10 objects ... ],
  "total": 10
}
```

---

### 2.5 — Suppliers: Filter by Region
```bash
curl "http://localhost:3000/api/suppliers?region=West"
```
**Expected:** `total: 3`, suppliers from Mumbai, Pune, Ahmedabad

```bash
curl "http://localhost:3000/api/suppliers?region=North"
```
**Expected:** `total: 3`, suppliers from Delhi, Noida, Jaipur

```bash
curl "http://localhost:3000/api/suppliers?region=South"
```
**Expected:** `total: 2`, suppliers from Bangalore, Chennai

```bash
curl "http://localhost:3000/api/suppliers?region=East"
```
**Expected:** `total: 2`, suppliers from Kolkata, Patna

---

### 2.6 — Suppliers: Filter by Category
```bash
curl "http://localhost:3000/api/suppliers?category=Packaging"
```
**Expected:** 1 result — ShriRam Packaging Co.

---

### 2.7 — Suppliers: Search
```bash
curl "http://localhost:3000/api/suppliers?search=chemicals"
```
**Expected:** 1 result — Bangalore Chemicals Ltd

---

### 2.8 — Suppliers: Verified Only
```bash
curl "http://localhost:3000/api/suppliers?is_verified=true"
```
**Expected:** 3 results — ShriRam Packaging Co., Delhi Electronics Hub, Bangalore Chemicals Ltd

---

### 2.9 — Suppliers: Get by ID
```bash
# Replace <ID> with any supplier id from the list response
curl http://localhost:3000/api/suppliers/<ID>
```
**Expected:**
```json
{
  "success": true,
  "supplier": { "id": "...", "name": "...", ... },
  "products": []
}
```

---

### 2.10 — Suppliers: By Region Route
```bash
curl http://localhost:3000/api/suppliers/region/West
```
**Expected:**
```json
{
  "success": true,
  "region": "West",
  "cities": ["Mumbai", "Pune", "Ahmedabad", "Surat", "Goa", "Nashik", "Rajkot"],
  "suppliers": [ ... 3 suppliers ... ]
}
```

---

### 2.11 — Suppliers: Categories List
```bash
curl http://localhost:3000/api/suppliers/categories/list
```
**Expected:** Array of 12 categories:
`["Industrial", "Construction", "Packaging", "Electronics", "Furniture", "Machinery", "Chemicals", "Office Supplies", "Food & Beverage Supply", "Logistics", "Textile", "Services"]`

---

### 2.12 — Opportunities: List All
```bash
curl http://localhost:3000/api/opportunities
```
**Expected:** `total: 5`, ordered by `created_at` descending

---

### 2.13 — Opportunities: Filter by Category
```bash
curl "http://localhost:3000/api/opportunities?category=Construction"
```
**Expected:** 1 result — New Township Construction Project

---

### 2.14 — Opportunities: Get by ID
```bash
curl http://localhost:3000/api/opportunities/<ID>
```
**Expected:**
```json
{
  "success": true,
  "opportunity": { "id": "...", "title": "...", "city": "...", ... }
}
```

---

### 2.15 — Unknown Route (404 handler)
```bash
curl http://localhost:3000/api/nonexistent
```
**Expected:**
```json
{ "success": false, "message": "Route not found" }
```
Status code: **404**

---

## SECTION 3 — Frontend: Auth Flow

### 3.1 — Login Screen
1. Open app → should land on login screen (if not authenticated)
2. **What you see:** Blue header, "+91" prefix input, "Continue" button
3. **Test invalid input:**
   - Tap "Continue" with empty field → button should be disabled or show validation
   - Enter less than 10 digits → should not proceed
4. **Test valid input:**
   - Enter: `9876543210` (10 digits)
   - Tap "Continue"
   - **Expected:** Navigator moves to OTP verify screen
   - **Expected in Firestore:** `otp_sessions` collection has new doc for `+919876543210`

---

### 3.2 — Verify OTP Screen
1. **What you see:** 6-box OTP input, "Verify" button, "Resend" option
2. **Test wrong OTP:**
   - Enter: `999999`
   - Tap "Verify"
   - **Expected:** Alert/error message "Invalid OTP"
3. **Test correct OTP:**
   - Clear and enter: `123456`
   - Tap "Verify"
   - **Expected for new user:** Navigate to Onboarding screen
   - **Expected for returning user:** Navigate to Home screen
4. **Test Resend:**
   - Tap "Resend OTP"
   - **Expected:** New `otp_sessions` document in Firestore (old one deleted), toast/alert "OTP sent"

---

### 3.3 — Onboarding Screen (new user only)
1. **What you see:** 3-step form — Name → Region → Categories
2. **Step 1:** Enter your name (e.g. "Test User") → tap Next
3. **Step 2:** Select a region (e.g. "West India") → tap Next
4. **Step 3:** Select 1-3 categories → tap "Complete Setup"
5. **Expected:** Navigate to Home screen
6. **Verify in Firestore:** `users` collection should have a new document with:
   - `id`: matches Firebase Auth UID
   - `name`: "Test User"
   - `mobile`: "+919876543210"
   - `type`: "buyer"
   - `city`: selected region city
   - `categories`: selected array
   - `is_verified`: false
   - `fcm_token`: null
   - `created_at`: ISO timestamp

---

## SECTION 4 — Frontend: Home Screen

### 4.1 — Initial Load
1. **What you see:** Search bar, region tabs (All / North India / South India / West India / East India), supplier cards, recent opportunities section
2. **Expected data:** Cards populated from Firestore (not mock data)
3. **Stats row:** Should show actual counts from API (10 suppliers, 5 opportunities, 6 regions)

### 4.2 — Region Filter
1. Tap "West India" tab
2. **Expected:** Only 3 suppliers shown (Mumbai, Pune, Ahmedabad)
3. Tap "North India"
4. **Expected:** Only 3 suppliers (Delhi, Noida, Jaipur)
5. Tap "All"
6. **Expected:** All suppliers shown

### 4.3 — Search
1. Type "chemicals" in search bar
2. **Expected:** Only Bangalore Chemicals Ltd appears
3. Clear search
4. **Expected:** All suppliers return

### 4.4 — Pull to Refresh
1. Pull down on the screen
2. **Expected:** Spinner shows, data refetches from API, UI updates

### 4.5 — Fallback (Backend Off)
1. Stop the backend (`Ctrl+C` in backend terminal)
2. Pull to refresh on Home screen
3. **Expected:** App still shows data (falls back to mock data silently — no crash)
4. Restart backend

---

## SECTION 5 — Frontend: Suppliers Screen

### 5.1 — List Load
1. Tap "Suppliers" tab
2. **Expected:** All 10 suppliers loaded from API

### 5.2 — Region Tab Filter
1. Tap "South India"
2. **Expected:** 2 suppliers (Bangalore Chemicals Ltd, Chennai Logistics Pro)

### 5.3 — Search
1. Type "furniture" in search bar  
2. **Expected:** Noida Furniture World appears

### 5.4 — Filter Modal
1. Tap the filter icon
2. Select a category (e.g. "Logistics")
3. Apply
4. **Expected:** Only Chennai Logistics Pro shown

### 5.5 — Supplier Card Tap
1. Tap any supplier card
2. **Expected:** Navigate to Supplier Detail screen (`/suppliers/[id]`)

---

## SECTION 6 — Frontend: Supplier Detail Screen

### 6.1 — Data Load
1. **What you see:** Loading spinner briefly, then supplier info
2. **Expected fields visible:**
   - Business name, city, region
   - Category badge
   - "Verified" badge (on ShriRam Packaging Co., Delhi Electronics Hub, Bangalore Chemicals Ltd)
   - Description text
   - Quick action buttons (Call, WhatsApp, Website)
3. **Verify:** Data comes from `GET /api/suppliers/:id` (not mock data)

### 6.2 — Save Supplier
1. Tap the bookmark/save icon
2. **Expected:** Icon fills / color changes to indicate saved
3. **Verify in Firestore:** `saved_suppliers` collection should have a new document:
   ```
   { id: uuid, user_id: <your uid>, supplier_id: <supplier id>, created_at: ... }
   ```
4. Tap again to unsave
5. **Expected:** Icon returns to empty state
6. **Verify in Firestore:** Document deleted from `saved_suppliers`

### 6.3 — Send Inquiry
1. Tap "Send Inquiry" / inquiry button
2. **Expected:** Modal opens with message + quantity fields
3. Fill in a message: "I need 500 units of packaging"
4. Tap "Send"
5. **Expected:** Success toast/alert, modal closes
6. **Verify in Firestore:** `inquiries` collection has new document:
   ```
   { id: uuid, user_id: <your uid>, supplier_id: <id>, message: "...", created_at: ... }
   ```

---

## SECTION 7 — Frontend: Opportunities Screen

### 7.1 — List Load
1. Tap "Opportunities" tab
2. **Expected:** All 5 opportunities from Firestore

### 7.2 — Status Tabs
1. Tap "Open" tab
2. **Expected:** Opportunities filtered (note: seeded opps have no status field — may show all or empty depending on your Opportunity type definition)
3. Tap "All"

### 7.3 — Search
1. Type "warehouse"
2. **Expected:** "Warehouse Development Project" appears

### 7.4 — Opportunity Card Tap
1. Tap any card
2. **Expected:** Navigate to Opportunity Detail screen

---

## SECTION 8 — Frontend: Opportunity Detail Screen

### 8.1 — Data Load
1. **Expected:** Loading spinner, then opportunity info visible
2. **Fields visible:** Title, city, category, description, CTA button label
3. **Verify:** Data from `GET /api/opportunities/:id`

### 8.2 — Apply / CTA Button
1. Tap the CTA button (e.g. "Submit Proposal")
2. **Expected:** Modal or confirmation appears
3. Submit application message
4. **Expected:** Success state, button changes to "Applied"

---

## SECTION 9 — Frontend: Profile Screen

### 9.1 — User Info Display
1. Tap "Profile" tab
2. **Expected:** Name and business name shown (from onboarding)
3. User avatar with initials

### 9.2 — Saved Suppliers Count
1. **Expected:** Saved suppliers count reflects what's in Firestore `saved_suppliers`
2. Tap "Saved Suppliers"
3. **Expected:** Modal opens with list of suppliers you saved in Section 6.2

### 9.3 — Inquiries Count
1. **Expected:** Count reflects the inquiry sent in Section 6.3
2. Tap "My Inquiries"
3. **Expected:** Modal shows inquiry with supplier name and message

### 9.4 — Logout
1. Tap "Logout"
2. **Expected:** Alert "Are you sure?" → confirm
3. **Expected:** Navigate back to Login screen
4. **Expected:** All user state cleared
5. Re-login with same number to verify session restores correctly

---

## SECTION 10 — Firebase Console Verification Checklist

After completing all tests above, verify in Firebase Console:

### Firestore Collections

| Collection | Expected Documents |
|---|---|
| `suppliers` | 10 (from seed) |
| `opportunities` | 5 (from seed) |
| `users` | 1+ (from your onboarding) |
| `otp_sessions` | 0 (all consumed after verify) |
| `saved_suppliers` | Count matches your save actions |
| `inquiries` | Count matches your inquiry sends |

### Firebase Authentication
1. Go to Firebase Console → Authentication → Users
2. **Expected:** Your test phone number `+919876543210` listed as a user
3. UID matches the `id` field in the `users` Firestore document

### Firestore Document Schema Spot Check

Open one `users` document — verify all fields exist:
```
id          → string (Firebase UID)
name        → string
mobile      → string ("+91XXXXXXXXXX" format)
type        → "buyer" or "supplier"
city        → string
company_name → string
categories  → array of strings
is_verified → false
fcm_token   → null
created_at  → ISO timestamp string
```

Open one `suppliers` document — verify all fields exist:
```
id          → string (UUID)
user_id     → string
name        → string
city        → string
state       → string
region      → "North" | "South" | "East" | "West"
category    → string (matches one of 12 categories)
description → string
is_verified → boolean
logo_url    → null
created_at  → ISO timestamp string
```

---

## SECTION 11 — Protected Route Tests (Auth Middleware)

These calls should all fail with 401 without a valid token:

```bash
# Should return 401
curl -X POST http://localhost:3000/api/inquiries \
  -H "Content-Type: application/json" \
  -d '{"supplier_id": "test", "message": "hello"}'
# Expected: { "success": false, "message": "No token provided" }

curl http://localhost:3000/api/saved
# Expected: { "success": false, "message": "No token provided" }

curl http://localhost:3000/api/users/me
# Expected: { "success": false, "message": "No token provided" }
```

```bash
# With fake/expired token — should return 401
curl http://localhost:3000/api/users/me \
  -H "Authorization: Bearer fake.token.here"
# Expected: { "success": false, "message": "Unauthorized" }
```

---

## SECTION 12 — Edge Cases

### 12.1 — Duplicate Save
After saving a supplier (Section 6.2):
```bash
curl -X POST http://localhost:3000/api/saved \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <valid token>" \
  -d '{"supplier_id": "<already-saved-id>"}'
```
**Expected:** `{ "success": false, "message": "Supplier already saved" }` (status **409**)

### 12.2 — OTP Expiry
1. Call `send-otp`
2. Wait 6 minutes (or manually change `expires_at` in Firestore to a past timestamp)
3. Call `verify-otp` with `123456`
4. **Expected:** `{ "success": false, "message": "OTP expired" }`

### 12.3 — Supplier Not Found
```bash
curl http://localhost:3000/api/suppliers/nonexistent-id-12345
```
**Expected:** `{ "success": false, "message": "Supplier not found" }` (status **404**)

### 12.4 — Navigation Between Screens
1. From Home → tap a supplier → go to detail → Press back → back on Home  ✅
2. From Suppliers list → tap → detail → back → still on Suppliers  ✅
3. From Opportunities → tap → detail → back → still on Opportunities  ✅

---

## SECTION 13 — TypeScript Compile Check

```bash
cd backend
npx tsc --noEmit
# Expected: No output (zero errors)
```

```bash
cd ..  # project root
npx tsc --noEmit
# Expected: Zero errors relevant to your source files
```

---

## Quick Pass/Fail Summary

| # | Test | Pass Criteria |
|---|---|---|
| 1 | Seed runs | 10 suppliers + 5 opps in Firestore |
| 2 | Health check | `{ status: "ok" }` at /health |
| 3 | Send OTP | otp_sessions doc created |
| 4 | Verify OTP wrong | 400 Invalid OTP |
| 5 | Verify OTP correct | token + isNewUser returned |
| 6 | Onboarding | users doc created in Firestore |
| 7 | Home screen loads | 10 supplier cards from API |
| 8 | Region filter | West=3, North=3, South=2, East=2 |
| 9 | Supplier detail loads | Data from API, not mock |
| 10 | Save supplier | saved_suppliers doc created |
| 11 | Unsave supplier | saved_suppliers doc deleted |
| 12 | Send inquiry | inquiries doc created |
| 13 | Profile saved count | Matches Firestore count |
| 14 | Logout | Returns to login, state cleared |
| 15 | Protected routes | 401 without token |
| 16 | Duplicate save | 409 Conflict |
| 17 | 404 route | `{ success: false, message: "Route not found" }` |
| 18 | TypeScript compile | Zero errors |

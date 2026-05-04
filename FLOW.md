# SupplierConnect — Complete User Flow Documentation

## Architecture Overview

```
Expo Router (file-based routing)
├── app/index.tsx          — Splash + auth redirect
├── app/(auth)/            — Unauthenticated flows
│   ├── login.tsx          — Phone number entry
│   ├── verify.tsx         — OTP verification
│   └── onboarding.tsx     — Profile setup (3 steps)
├── app/(tabs)/            — Main app (bottom tabs)
│   ├── home.tsx           — Dashboard
│   ├── suppliers.tsx      — Supplier search + filter
│   ├── opportunities.tsx  — Opportunities feed
│   └── profile.tsx        — User profile + activity
├── app/suppliers/[id].tsx     — Supplier detail + inquiry modal
└── app/opportunities/[id].tsx — Opportunity detail + apply modal

State Stores (Zustand + AsyncStorage):
├── authStore.ts      — user, isAuthenticated, phoneNumber
├── filtersStore.ts   — supplier and opportunity filter state
└── userDataStore.ts  — savedSupplierIds, inquiries, applications
```

---

## Flow 1: New User Registration

### Step-by-step:

1. **App Launches** → `app/index.tsx`
   - Shows "SupplierConnect" logo + spinner
   - Reads AsyncStorage via `authStore.hydrate()`
   - If no saved user → redirects to `/( auth)/login` after hydration

2. **Login Screen** → `app/(auth)/login.tsx`
   - User enters 10-digit mobile number (numbers only, max 10 digits)
   - "+91" prefix is shown, not editable
   - "Continue" button enables only when 10 digits entered
   - Press Continue → 1 second simulated API call → navigates to `/verify`
   - **Demo mode**: Tap "Demo: Tap to fill test number" → fills `9876543210`

3. **OTP Verification** → `app/(auth)/verify.tsx`
   - Shows masked phone number
   - 6 OTP boxes displayed (custom OTPInput component)
   - Resend countdown: 30 seconds → then "Resend Code" appears
   - Enter any 6 digits → `onComplete` fires → 1.5 second simulated verify → navigates to `/onboarding`
   - Guards: `verifyingRef` prevents duplicate navigation if `onComplete` fires twice
   - **Demo mode**: Tap "Demo: Tap to fill test OTP (123456)"

4. **Onboarding** → `app/(auth)/onboarding.tsx`
   - **Step 1 — Profile**: Name (min 2 chars), Business Name (min 2 chars), Email (optional)
   - **Step 2 — Region**: Select one of 6 regions (single select, checkmark indicator)
   - **Step 3 — Categories**: Select 1–5 categories from 10 options
   - "Continue" validates each step before proceeding
   - On completion: creates `User` object → saved via `authStore.setUser()` → persisted to AsyncStorage → navigates to `/(tabs)/home`

**Expected result**: User is now authenticated. Closing and reopening the app will auto-login to Home.

---

## Flow 2: Returning User (Auto-Login)

1. App launches → `index.tsx` hydrates auth from AsyncStorage
2. `isAuthenticated === true` → immediately redirects to `/(tabs)/home`
3. User lands on Home with their name displayed ("Good Morning, [Name] 👋")

**Expected result**: No login required on subsequent launches.

---

## Flow 3: Supplier Discovery Flow

### Step 1: Home Screen (`app/(tabs)/home.tsx`)

- Displays greeting with user name
- **Search bar** at top → searches supplier name, business name, categories
- **Region tabs** (horizontal scroll): All / North / South / East / West / Central / Northeast
- **Stats row**: total suppliers, opportunities, regions
- **Top Suppliers** section: shows up to 5 filtered suppliers
- **Recent Opportunities**: shows 3 latest open opportunities
- Each card is tappable → navigates to detail page

### Step 2: Suppliers Tab (`app/(tabs)/suppliers.tsx`)

- Full FlatList of all suppliers
- **Search bar**: debounced, searches name + categories
- **Region filter tabs**: same as Home
- **Filter modal**: tap filter icon (top-right) → opens slide-up modal
  - Categories: multi-select chips
  - Sort By: Highest Rated / Name A–Z / Most Recent
  - Reset / Apply buttons
- Supplier cards show: name, region, city, rating, categories, verified badge
- Tap any card → `app/suppliers/[id].tsx`

### Step 3: Supplier Detail (`app/suppliers/[id].tsx`)

- **Hero**: initials avatar, business name, contact name, star rating, location
- **Quick Actions**: Call (opens phone dialer), Email (opens mail), Save (bookmarks), Website (opens browser)
- **About**: full description text
- **Business Details**: years in business, min order value, location
- **Categories**: category badges
- **CTA buttons**:
  - "Send Inquiry" → opens inquiry modal
  - "Call Directly" → opens phone dialer

### Step 4: Send Inquiry Modal

- Slide-up sheet with:
  - Supplier info strip (name, location)
  - **Message field** (required) — multi-line
  - **Required Quantity** (optional)
  - Contact info preview (from authStore)
  - "Send Inquiry" button
- On submit: 1 second delay → saves inquiry to `userDataStore` (persisted to AsyncStorage) → success alert
- Inquiry is now visible in Profile → Sent Inquiries

### Region Filter Logic:

- Selecting "North India" → filters `supplier.region === 'North India'`
- Cities within regions (from `REGION_CITIES` in constants): Delhi, Noida, Gurgaon, Jaipur, Lucknow (North); Bangalore, Chennai, Hyderabad (South); etc.
- All 8 mock suppliers cover all 6 regions → each region tab shows relevant suppliers

---

## Flow 4: Opportunities Flow

### Step 1: Opportunities Tab (`app/(tabs)/opportunities.tsx`)

- **Status tabs**: All / Open / In Progress / Closed (with counts)
- **Search bar**: searches title, description, category
- **Result count** shown below tabs
- Cards show: title, budget, deadline, category badge, applicant count

### Step 2: Opportunity Detail (`app/opportunities/[id].tsx`)

- Header with status badge (green Open, amber In-Progress, red Closed)
- Budget range, deadline countdown ("X days left" / "Expired")
- **Posted By**: poster avatar, name, business, verified badge
- **Description**, **Requirements** (checklist), **Details** (region, quantity, deadline)
- **CTA**:
  - If already applied → green "Interest Already Submitted" banner
  - If open → "Express Interest" button
  - If closed → disabled "Opportunity Closed" button

### Step 3: Express Interest Modal

- Slide-up sheet with:
  - Opportunity info strip
  - **Message field** (required) — "Why are you a good fit?"
  - "Submitting as" info (from authStore)
  - "Submit Application" button
- On submit: saves application to `userDataStore` → success alert
- Application visible in Profile → My Applications

---

## Flow 5: Profile & Activity

### Profile Tab (`app/(tabs)/profile.tsx`)

- User avatar with initials, name, business, phone
- Verified badge if `user.isVerified === true`
- Region + category badges

**Activity Stats (3 tappable tiles)**:
| Tile | Taps to |
|------|---------|
| Saved (n) | Saved Suppliers modal |
| Inquiries (n) | Sent Inquiries modal |
| Applied (n) | My Applications modal |

**Saved Suppliers modal**: list of saved suppliers with View + Remove buttons
**Sent Inquiries modal**: list of inquiries with status badge (pending/replied/closed)
**My Applications modal**: list of opportunity applications with status

**Menu sections**:

- Account: Edit Profile, Business Details, Verification (badge if unverified)
- My Activity: Saved Suppliers, Sent Inquiries, Applications (same as stat tiles)
- Preferences: Notifications, Region, Categories (Coming Soon)
- Support: Help, Contact, Terms (Coming Soon)
- Logout: confirms with Alert → clears auth → redirects to Login

---

## Test Cases

### TC-01: Full Registration Flow

```
1. Open app (fresh install / cleared data)
2. See splash screen with spinner
3. Auto-redirect to Login
4. Enter: 9876543210
5. Tap Continue → loading spinner → OTP screen
6. Tap demo OTP → 6 boxes fill with "123456"
7. Auto-verify → Onboarding opens
8. Enter Name: "Rahul Sharma", Business: "RS Enterprises"
9. Tap Continue → Region screen
10. Select "West India" → checkmark appears
11. Tap Continue → Categories screen
12. Select "Packaging", "Agriculture"
13. Tap "Get Started" → loading → Home screen opens
EXPECTED: Home shows "Good [time], Rahul Sharma 👋"
```

### TC-02: Region Filter — Supplier Count

```
1. Go to Suppliers tab
2. Tap "North India" region filter
EXPECTED: Shows "Sharma Steel Industries" (Delhi) + "Singh Food Products" (Lucknow) = 2 suppliers

3. Tap "West India"
EXPECTED: Shows "Patel Packaging Solutions" (Mumbai) + "Desai Agro Supplies" (Pune) = 2 suppliers

4. Tap "South India"
EXPECTED: Shows "Reddy Electronics Hub" (Hyderabad) + "Nair Chemicals" (Chennai) = 2 suppliers
```

### TC-03: Send Inquiry

```
1. Go to Suppliers tab
2. Tap "Sharma Steel Industries"
3. Tap "Send Inquiry"
4. Leave message blank → Tap "Send Inquiry"
EXPECTED: Alert "Required - Please enter a message"

5. Enter message: "Need 20 tons of TMT bars for construction"
6. Quantity: "20 tons"
7. Tap "Send Inquiry"
EXPECTED: Loading spinner → success alert → modal closes

8. Go to Profile tab
9. Tap "Inquiries (1)" tile
EXPECTED: Shows inquiry with "pending" status badge, message preview, timestamp
```

### TC-04: Express Interest in Opportunity

```
1. Go to Opportunities tab
2. Tap "Steel Rods for Construction Project" (status: Open)
3. Tap "Express Interest"
4. Enter message: "We are ISO-certified steel supplier with 15 years experience"
5. Tap "Submit Application"
EXPECTED: Success alert

6. Navigate back to same opportunity
EXPECTED: "Interest Already Submitted" green banner instead of button

7. Go to Profile → Tap "Applied (1)"
EXPECTED: Application listed with "submitted" status
```

### TC-05: Save Supplier

```
1. Open any supplier detail
2. Tap "Save" (bookmark icon)
EXPECTED: Bookmark icon fills solid, alert "Added to favorites!"

3. Go to Profile → Tap "Saved (1)"
EXPECTED: Saved supplier listed with "View" and delete (trash) buttons

4. Tap delete (trash icon)
EXPECTED: Supplier removed from list

5. Go back to supplier detail
EXPECTED: Bookmark icon is outline (not saved)
```

### TC-06: Returning User Auto-Login

```
1. Complete TC-01 (full registration)
2. Close Expo Go
3. Reopen Expo Go / reload
EXPECTED: Splash screen briefly → auto-redirect to Home (NO login screen)
```

### TC-07: Opportunity Status Filters

```
1. Go to Opportunities tab
2. Tap "Open" filter
EXPECTED: Shows 3 opportunities (id 1, 2, 4 all have status "open")

3. Tap "In Progress"
EXPECTED: Shows 1 opportunity

4. Tap "Closed"
EXPECTED: Shows 1 opportunity (CNC Machines)
```

### TC-08: Search Functionality

```
1. Go to Suppliers tab
2. Type "electronics"
EXPECTED: Shows "Reddy Electronics Hub" only

3. Clear search → type "packaging"
EXPECTED: Shows "Patel Packaging Solutions"

4. Go to Opportunities tab
5. Search "cotton"
EXPECTED: Shows "Cotton Fabric for Garment Export"
```

---

## Edge Cases

### Empty Search

- Search returns empty → `EmptyState` component shown
  - "No suppliers found" with "Clear Filters" action button
- Clearing filters resets all to default state

### No Saved Suppliers

- Profile → Saved tile shows 0
- Saved modal shows empty state: bookmark icon + instructions

### Network Errors

- All async operations wrapped in try/catch
- Auth store `hydrate()` has error handler → sets `isLoading: false` on failure
- userDataStore `hydrate()` has error handler → graceful degradation to empty state
- If AsyncStorage fails on save → error logged to console, UI not affected

### Closing App Mid-Onboarding

- Auth hydrate checks for full `user` object
- Partial onboarding state (only phone set) → `isAuthenticated === false` → redirects to login
- User must complete onboarding again

### OTP Duplicate Navigation

- `verifyingRef.current` guard in `verify.tsx` prevents double navigation
- `completedValueRef` in `OTPInput.tsx` prevents `onComplete` firing twice for same value

### Supplier Not Found

- `getSupplierById(id)` returns undefined → renders "Supplier not found" screen
- Back button still works

---

## Demo Script (CTO / Board Presentation)

```
1. Show splash → auto-login (returning user)
2. Show Home: "Good Morning, [Name]"
3. Tap North India region → filtered suppliers
4. Tap a supplier card → detail view
5. Tap "Save" → bookmark fills
6. Tap "Send Inquiry" → fill form → submit → success
7. Go to Opportunities → show status filters
8. Tap "Express Interest" on an open opportunity → submit
9. Go to Profile → show stats: Saved 1, Inquiries 1, Applied 1
10. Tap each stat tile → show lists
11. Show logout flow (optional)
```

# SupplierConnect — Debug Report & Audit

## Audit Date: 3 May 2026

## Engineer: GitHub Copilot (Full-Stack Audit)

---

## TASK 1 — FUNCTIONALITY AUDIT RESULTS

| Feature                             | Status             | Notes                                                        |
| ----------------------------------- | ------------------ | ------------------------------------------------------------ |
| Splash / Auth redirect              | ✅ Fully working   | 3-sec timeout fallback added                                 |
| Phone login (UI)                    | ✅ Fully working   | Mock 1s delay, navigates to OTP                              |
| OTP verification                    | ⚠️ Mock only       | Any 6 digits accepted — Firebase Auth not connected (see §3) |
| Onboarding — Profile step           | ✅ Fully working   | Name, business, email with validation                        |
| Onboarding — Region step            | ✅ Fully working   | Single-select, checkmark indicator                           |
| Onboarding — Categories step        | ✅ Fully working   | Multi-select, max 5 cap                                      |
| Auth persistence (AsyncStorage)     | ✅ Fully working   | Returned user auto-logs in                                   |
| Logout                              | ✅ Fully working   | Clears store + AsyncStorage                                  |
| Home — Greeting                     | ✅ Fully working   | Dynamic time-of-day + user name                              |
| Home — Search bar                   | ✅ Fully working   | Debounced, filters supplier list                             |
| Home — Region tabs                  | ✅ Fully working   | Filters suppliers by region                                  |
| Home — Top Suppliers section        | ✅ Fully working   | Shows up to 5 filtered suppliers                             |
| Home — Opportunities preview        | ✅ Fully working   | Shows 3 latest open opportunities                            |
| Suppliers tab — Search              | ✅ Fully working   | Searches name + categories                                   |
| Suppliers tab — Region filter       | ✅ Fully working   | All 6 regions, dynamic count                                 |
| Suppliers tab — Filter modal        | ✅ Fully working   | Category + Sort By with Reset/Apply                          |
| Supplier Detail — Info display      | ✅ Fully working   | All fields rendered correctly                                |
| Supplier Detail — Call/Email        | ✅ Fully working   | Opens device dialer/mail                                     |
| Supplier Detail — Save button       | ❌ BROKEN → FIXED  | Was fake Alert, now saves to userDataStore                   |
| Supplier Detail — Send Inquiry      | ❌ MISSING → ADDED | No inquiry form existed; full modal added                    |
| Region → City mapping               | ❌ MISSING → ADDED | `REGION_CITIES` map added to constants                       |
| Opportunities tab — Feed            | ✅ Fully working   | FlatList, sorted by date                                     |
| Opportunities tab — Status filter   | ✅ Fully working   | All/Open/In-Progress/Closed                                  |
| Opportunities tab — Search          | ✅ Fully working   | Searches title + description + category                      |
| Opportunity Detail — Display        | ✅ Fully working   | All fields, days left countdown                              |
| Opportunity Detail — Apply          | ❌ FAKE → FIXED    | Was `Alert.alert()` only; full apply modal added             |
| Opportunity — Already applied guard | ❌ MISSING → ADDED | Shows "Interest Already Submitted" on revisit                |
| Profile — User info display         | ✅ Fully working   | Shows name, business, phone, region, categories              |
| Profile — Saved Suppliers           | ❌ MISSING → ADDED | Was not implemented; full modal with list added              |
| Profile — Sent Inquiries list       | ❌ MISSING → ADDED | New modal showing all sent inquiries                         |
| Profile — Applications list         | ❌ MISSING → ADDED | New modal showing all opportunity applications               |
| Profile — Activity stats tiles      | ❌ MISSING → ADDED | 3 tappable tiles (Saved / Inquiries / Applied)               |
| Profile — Logout                    | ✅ Fully working   | Confirmed with Alert, clears all state                       |
| Navigation — Bottom tabs            | ✅ Fully working   | 4 tabs with correct icons                                    |
| Navigation — Auth flow stack        | ✅ Fully working   | login → verify → onboarding                                  |
| Navigation — Detail pages           | ✅ Fully working   | suppliers/[id] + opportunities/[id]                          |

**Summary**: 8 features were broken or missing. All have been fixed/implemented.

---

## TASK 2 — WHAT WAS BROKEN & WHAT WAS FIXED

### 1. Blank White Screen (Previous Session — FIXED)

**Root Cause 1**: Empty directories (`app/(auth)/login/`, `verify/`, `onboarding/`) conflicted with `.tsx` route files in Expo Router.  
**Fix**: Removed empty directories.

**Root Cause 2**: `babel.config.js` had both `jsxImportSource: "nativewind"` AND `"nativewind/babel"` preset. The `nativewind/babel` preset is an alias for `react-native-css-interop/babel` which adds its own `@babel/plugin-transform-react-jsx` with `importSource: "react-native-css-interop"`. This created two competing JSX factories — resulting in `_nativewind.createElement is not a function` at runtime.  
**Fix**: Removed `"nativewind/babel"` from presets. Added a runtime className→style shim (`src/utils/classNameShim.ts`) to preserve className-based styling.

### 2. Thick Borders on OTP Input (FIXED)

**Root Cause**: `OTPInput.tsx` used `border-2` className which the shim applied as borderWidth 2.  
**Fix**: Removed all border classes from OTP boxes; replaced with shadow-based elevation styling.

### 3. "Create Your Profile" Appearing Multiple Times (FIXED)

**Root Cause 1**: `OTPInput` useEffect fired `onComplete` on every render when `value.length === 6`, even for the same value.  
**Fix**: Added `completedValueRef` — only calls `onComplete` when `value` changes to a new completed state.

**Root Cause 2**: `handleVerify` in `verify.tsx` had no guard against being called concurrently from both `onComplete` and the manual "Verify" button press.  
**Fix**: Added `verifyingRef = useRef(false)` guard with `useCallback`.

### 4. Save Button Was Fake (FIXED)

**Root Cause**: `Alert.alert('Saved', '...')` called directly — no state saved anywhere.  
**Fix**: Connected to new `useUserDataStore` — `saveSupplier()` / `unsaveSupplier()` / `isSaved()`. Bookmark icon updates to filled state. Persisted to AsyncStorage.

### 5. "Send Inquiry" Was Missing Entirely (IMPLEMENTED)

**Root Cause**: The "Contact Supplier" CTA button only called `Linking.openURL(tel:...)`.  
**Fix**: Added full inquiry modal with:

- Message field (required, multi-line)
- Quantity field (optional)
- Contact info preview from auth store
- Submission stored in `userDataStore.inquiries[]` with `status: 'pending'`
- Persisted to AsyncStorage

### 6. "Express Interest" Was a Fake Alert (FIXED)

**Root Cause**: Button called `Alert.alert('Interest Registered', '...')` with no state persistence.  
**Fix**: Added full apply modal with:

- Message field (required)
- "Submitting as" info from auth store
- Submission stored in `userDataStore.applications[]` with `status: 'submitted'`
- Re-visiting the opportunity now shows "Interest Already Submitted" banner
- Persisted to AsyncStorage

### 7. Profile Had No Activity Tracking (IMPLEMENTED)

**Root Cause**: No `userDataStore` existed. Profile showed only static account menu items.  
**Fix**: Added:

- 3-tile stats bar (Saved / Inquiries / Applied)
- "My Activity" menu section
- 3 slide-up modals for each activity type
- Saved Suppliers modal: View + Remove buttons
- Inquiries modal: status badge, message preview, timestamp
- Applications modal: status badge, message preview, date

### 8. Region → City Mapping Missing (ADDED)

**Root Cause**: `REGION_CITIES` constant did not exist.  
**Fix**: Added `REGION_CITIES: Record<Region, string[]>` to `src/constants/index.ts`. The filter store already filters by `supplier.region` which correctly maps to cities in each region.

---

## TASK 3 — NEW FILES CREATED

| File                         | Purpose                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------ |
| `src/store/userDataStore.ts` | Manages saved suppliers, inquiries, applications with AsyncStorage persistence |
| `FLOW.md`                    | Complete user journey documentation + test cases                               |
| `DEBUG_REPORT.md`            | This file                                                                      |

---

## TASK 4 — MODIFIED FILES

| File                         | Change                                                                      |
| ---------------------------- | --------------------------------------------------------------------------- |
| `src/constants/index.ts`     | Added `REGION_CITIES` map                                                   |
| `src/utils/classNameShim.ts` | Added `min-h`, `capitalize`, `green-200`, extended size handling            |
| `app/_layout.tsx`            | Added `useUserDataStore.hydrate()` call on app start                        |
| `app/(auth)/login.tsx`       | Converted from StyleSheet to NativeWind className (failed attempt reverted) |
| `app/(auth)/onboarding.tsx`  | Fixed `border-2` → `border` on region/category selectors                    |
| `app/suppliers/[id].tsx`     | Full rewrite: real Save + Inquiry modal                                     |
| `app/opportunities/[id].tsx` | Full rewrite: real Apply modal + already-applied guard                      |
| `app/(tabs)/profile.tsx`     | Full rewrite: activity stats + 3 modals                                     |

---

## WHAT IS STILL INCOMPLETE (BY DESIGN)

These features are not implemented but are clearly marked "Coming Soon" in the UI:

| Feature                     | Reason Deferred                                  |
| --------------------------- | ------------------------------------------------ |
| Firebase OTP (real SMS)     | Requires Firebase project credentials + billing  |
| Firebase Firestore sync     | Requires Firebase project setup + security rules |
| Edit Profile                | Non-trivial UX, not in demo scope                |
| Business Verification       | Requires admin review workflow                   |
| Push Notifications          | Requires FCM setup                               |
| Supplier photos/images      | Requires Firebase Storage                        |
| Real applicant counts       | Would need Firestore aggregation                 |
| Chat between buyer/supplier | Separate real-time feature                       |

---

## Firebase Integration Path (When Ready)

To replace mock data with real Firebase:

1. Install: `npx expo install firebase`
2. Configure in `src/config/firebase.ts` (file exists, needs credentials)
3. **Auth**: Replace `setTimeout` in `login.tsx` + `verify.tsx` with:
   ```ts
   import { signInWithPhoneNumber } from "firebase/auth";
   // login.tsx: call signInWithPhoneNumber(auth, `+91${phone}`, recaptchaVerifier)
   // verify.tsx: call confirmationResult.confirm(otp)
   ```
4. **Firestore**: Replace `mockSuppliers` / `mockOpportunities` with Firestore queries
5. **Inquiries**: Replace `userDataStore.sendInquiry()` with `addDoc(collection(db, 'inquiries'), {...})`
6. **Applications**: Same pattern with `applications` collection

---

## Performance Notes

- All filter operations use `useMemo` with correct dependency arrays
- Search is debounced (300ms) via `useDebounce` hook
- FlatList used for all long lists (not ScrollView) — correct virtualization
- AsyncStorage operations are fire-and-forget (non-blocking)
- OTPInput uses `useRef` guards to avoid duplicate callbacks

---

## Known Limitations

- `className` prop relies on the runtime shim (`src/utils/classNameShim.ts`) patching `react/jsx-runtime` — not true NativeWind compilation. Dynamic classNames that use interpolated values may not work without being included in the shim's token table.
- Shadow/elevation effects on Android may differ from iOS due to platform differences.
- `Linking.openURL` for phone/email requires the device to have a dialer/mail app configured.

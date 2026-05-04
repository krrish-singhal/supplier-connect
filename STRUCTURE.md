# SupplierConnect — App Structure

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native (Expo SDK 54) |
| Router | Expo Router v6 (file-based) |
| Language | TypeScript |
| State Management | Zustand + AsyncStorage |
| Styling | className-based (classNameShim runtime shim) |
| JS Engine | Hermes |
| Backend (stub) | Express.js + Firebase Admin |

---

## Complete File Hierarchy

```
SupplierConnect/
│
├── app/                              ← Expo Router screens (file = route)
│   ├── _layout.tsx                   ← Root layout: ErrorBoundary, SafeAreaProvider, Stack navigator
│   ├── index.tsx                     ← Splash screen + auth redirect guard
│   │
│   ├── (auth)/                       ← Unauthenticated route group
│   │   ├── _layout.tsx               ← Auth group stack layout
│   │   ├── login.tsx                 ← Phone number entry (+91 prefix)
│   │   ├── verify.tsx                ← OTP verification (6-digit)
│   │   └── onboarding.tsx            ← 3-step profile setup (Name → Region → Categories)
│   │
│   ├── (tabs)/                       ← Main app route group (bottom tab bar)
│   │   ├── _layout.tsx               ← Tab bar layout (4 tabs)
│   │   ├── home.tsx                  ← Dashboard: search, region tabs, top suppliers, recent opportunities
│   │   ├── suppliers.tsx             ← Supplier list: search, region filter, filter modal
│   │   ├── opportunities.tsx         ← Opportunities feed: status tabs, search
│   │   └── profile.tsx               ← User profile, activity stats, modals (Saved / Inquiries / Applications)
│   │
│   ├── suppliers/
│   │   └── [id].tsx                  ← Supplier detail: hero, quick actions, about, inquiry modal
│   │
│   └── opportunities/
│       └── [id].tsx                  ← Opportunity detail: budget, deadline, apply modal
│
├── src/                              ← Application source (non-screen code)
│   │
│   ├── components/                   ← Reusable UI components
│   │   ├── index.ts                  ← Barrel export (Badge, Button, etc.)
│   │   ├── cards/
│   │   │   ├── SupplierCard.tsx      ← Supplier list card (name, rating, region, categories)
│   │   │   └── OpportunityCard.tsx   ← Opportunity list card (title, budget, deadline, status)
│   │   └── ui/
│   │       ├── Badge.tsx             ← Pill badge (category / status / verified)
│   │       ├── Button.tsx            ← Primary / outline / ghost button variants
│   │       ├── Input.tsx             ← Controlled text input with label
│   │       ├── OTPInput.tsx          ← 6-box OTP input (shadow style, completedValueRef guard)
│   │       ├── SearchBar.tsx         ← Debounced search input with clear icon
│   │       ├── RegionTabs.tsx        ← Horizontal scrollable region filter tabs
│   │       ├── EmptyState.tsx        ← Empty list placeholder (icon + message + action)
│   │       └── Skeleton.tsx          ← Loading skeleton placeholder
│   │
│   ├── store/                        ← Zustand state stores
│   │   ├── authStore.ts              ← user, isAuthenticated, isLoading, setUser, logout, hydrate
│   │   ├── filtersStore.ts           ← search, region, category filter state for suppliers + opportunities
│   │   └── userDataStore.ts          ← savedSupplierIds[], inquiries[], applications[], hydrate
│   │
│   ├── data/
│   │   └── mockData.ts               ← 8 mock suppliers + 5 mock opportunities (all regions covered)
│   │
│   ├── types/
│   │   └── index.ts                  ← TypeScript interfaces: User, Supplier, Opportunity, Inquiry, Application
│   │
│   ├── constants/
│   │   └── index.ts                  ← REGIONS[], CATEGORIES[], REGION_CITIES mapping
│   │
│   ├── hooks/
│   │   └── useDebounce.ts            ← Generic debounce hook (used in search bars)
│   │
│   ├── config/
│   │   └── firebase.ts               ← Firebase client SDK init (currently unused — mock data mode)
│   │
│   └── utils/
│       └── classNameShim.ts          ← Runtime shim: patches react/jsx-runtime to convert className → RN style objects
│
├── backend/                          ← Express.js API server (stub, not connected to app)
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts                  ← Express server entry point (port 3000)
│       ├── config/
│       │   └── firebase.ts           ← Firebase Admin SDK init
│       └── routes/
│           ├── auth.ts               ← POST /auth/send-otp, POST /auth/verify-otp
│           ├── suppliers.ts          ← GET /suppliers, GET /suppliers/:id
│           ├── opportunities.ts      ← GET /opportunities, GET /opportunities/:id
│           └── users.ts              ← GET /users/:id, PUT /users/:id
│
├── assets/                           ← Static assets (images, fonts, icons)
│
├── components/                       ← shadcn/ui stubs (web — not used in RN app)
│   └── ui/                           ← accordion, button, card, dialog, etc. (unused)
│
├── hooks/                            ← Web hooks stubs (unused in RN)
├── lib/                              ← Web utils stubs (unused in RN)
├── styles/                           ← globals.css (web only)
│
├── app.json                          ← Expo app config (name, slug, icons, scheme)
├── babel.config.js                   ← Babel: babel-preset-expo ONLY (no nativewind/babel)
├── metro.config.js                   ← Metro bundler config
├── tailwind.config.js                ← Tailwind config (classNameShim reference)
├── tsconfig.json                     ← TypeScript config (paths alias: @/ → root)
├── package.json                      ← Dependencies
└── .env.example                      ← Firebase env var template
```

---

## Route Map

| URL / Route | Screen | Auth Required |
|---|---|---|
| `/` | Splash + redirect | No |
| `/(auth)/login` | Phone number entry | No |
| `/(auth)/verify` | OTP verification | No |
| `/(auth)/onboarding` | Profile setup (3 steps) | No |
| `/(tabs)/home` | Home dashboard | Yes |
| `/(tabs)/suppliers` | Supplier list | Yes |
| `/(tabs)/opportunities` | Opportunities feed | Yes |
| `/(tabs)/profile` | User profile + activity | Yes |
| `/suppliers/[id]` | Supplier detail | Yes |
| `/opportunities/[id]` | Opportunity detail | Yes |

---

## State Architecture

```
authStore (Zustand + AsyncStorage)
├── user: User | null
├── isAuthenticated: boolean
├── isLoading: boolean
├── phoneNumber: string
├── setUser(user) → persists to AsyncStorage
├── logout() → clears AsyncStorage + redirects
└── hydrate() → reads AsyncStorage on app start

filtersStore (Zustand, in-memory)
├── supplierSearch: string
├── supplierRegion: string         ("All" | "North India" | …)
├── supplierCategories: string[]
├── supplierSortBy: string
├── opportunitySearch: string
├── opportunityStatus: string      ("all" | "open" | "in-progress" | "closed")
└── reset actions for each

userDataStore (Zustand + AsyncStorage)
├── savedSupplierIds: string[]
├── inquiries: Inquiry[]
├── applications: Application[]
├── saveSupplier(supplier) / unsaveSupplier(id) / isSaved(id)
├── sendInquiry(data) → appends + persists
├── applyToOpportunity(data) → appends + persists
├── hasApplied(opportunityId): boolean
└── hydrate() → reads AsyncStorage on app start
```

---

## Data Flow

```
App Launch
  └─→ _layout.tsx
        ├─→ classNameShim (patches jsx-runtime)
        ├─→ authStore.hydrate()      (AsyncStorage → user state)
        └─→ userDataStore.hydrate()  (AsyncStorage → saved/inquiries/applications)

User Action: Send Inquiry
  └─→ suppliers/[id].tsx
        └─→ userDataStore.sendInquiry()
              └─→ AsyncStorage.setItem("inquiries", JSON.stringify([...]))
                    └─→ profile.tsx activity count updates on next render

User Action: Save Supplier
  └─→ suppliers/[id].tsx
        └─→ userDataStore.saveSupplier()
              └─→ AsyncStorage.setItem("savedSupplierIds", JSON.stringify([...]))

User Action: Apply to Opportunity
  └─→ opportunities/[id].tsx
        └─→ userDataStore.applyToOpportunity()
              └─→ AsyncStorage.setItem("applications", JSON.stringify([...]))
```

---

## Styling Architecture

```
classNameShim (src/utils/classNameShim.ts)
  ├─ Imported FIRST in app/_layout.tsx
  ├─ Patches React.createElement + jsx-runtime at runtime
  ├─ Converts className string → React Native StyleSheet object
  └─ Supported tokens:
       ├─ Layout:    flex-1, flex-row, items-center, justify-*, self-*
       ├─ Spacing:   p-*, px-*, py-*, pt-*, pb-*, m-*, mx-*, my-*, mt-*, mb-*, gap-*
       ├─ Size:      w-*, h-*, min-w-*, max-w-*, rounded-*, rounded-full
       ├─ Colors:    bg-*, text-*, border-*  (slate, blue, green, amber, red, white)
       ├─ Typography: text-xs/sm/base/lg/xl/2xl, font-normal/medium/semibold/bold
       ├─ Borders:   border, border-0, border-b, border-t, border-r, border-l
       ├─ Opacity:   opacity-0 → opacity-100
       ├─ Shadow:    shadow, shadow-sm, shadow-md, shadow-lg
       └─ Overflow:  overflow-hidden, overflow-scroll

NOTE: NativeWind compiler is NOT active.
babel.config.js uses babel-preset-expo only (no nativewind/babel).
Reason: nativewind/babel causes "_nativewind.createElement is not a function" crash on Expo SDK 54.
```

---

## Component Dependency Map

```
Screens
├── home.tsx            → SupplierCard, OpportunityCard, SearchBar, RegionTabs, EmptyState
├── suppliers.tsx       → SupplierCard, SearchBar, RegionTabs, EmptyState, filtersStore
├── opportunities.tsx   → OpportunityCard, SearchBar, EmptyState, filtersStore
├── profile.tsx         → authStore, userDataStore
├── suppliers/[id].tsx  → Badge, Button, authStore, userDataStore
└── opportunities/[id].tsx → Badge, Button, authStore, userDataStore

Shared Components
├── SupplierCard.tsx    → Badge
├── OpportunityCard.tsx → Badge
├── SearchBar.tsx       → (standalone)
├── RegionTabs.tsx      → (standalone)
├── OTPInput.tsx        → (standalone, used in verify.tsx)
├── EmptyState.tsx      → (standalone)
└── Badge.tsx           → (standalone)
```

---

## Key Configuration Files

| File | Purpose |
|---|---|
| `app.json` | Expo app name (`SupplierConnect`), bundle ID, icons, scheme |
| `babel.config.js` | `babel-preset-expo` only — **do not add nativewind/babel** |
| `metro.config.js` | Metro bundler with NativeWind CSS interop (passive) |
| `tsconfig.json` | Path alias `@/*` → project root |
| `tailwind.config.js` | Tailwind content paths (reference for classNameShim tokens) |
| `.env.example` | `FIREBASE_API_KEY`, `FIREBASE_PROJECT_ID`, etc. |

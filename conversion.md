# Sparky — Next.js → MERN Stack Conversion Tracker

> **Last Updated:** 2026-11-21

## Overview
Complete migration of **Sparky** (a home services booking platform) from a monolithic Next.js 14 (App Router) application into a full **MERN Stack** (MongoDB, Express.js, React.js with Vite, Node.js) architecture with separated client and server.

---

## Directory Architecture
```
with-sparky/
├── client/                     # React.js (Vite) Frontend — SPA
│   ├── public/                 # Static assets (images, icons, manifest, sw.js, invoices)
│   ├── src/
│   │   ├── components/         # 24 reusable UI & Layout components
│   │   ├── pages/              # 26 route-level page components
│   │   ├── lib/                # Client utilities (firebase.js, utils.js)
│   │   ├── App.jsx             # React Router routing + ClientLayout logic
│   │   ├── main.jsx            # React root mount + BrowserRouter + Service Worker
│   │   └── index.css           # Tailwind + Custom Design System CSS
│   ├── index.html              # HTML entry (Plus Jakarta Sans, Google Maps, PWA meta)
│   ├── vite.config.js          # Vite config with '@' alias & API proxy → port 5000
│   └── package.json            # 15 dependencies (react, vite, framer-motion, leaflet, etc.)
│
├── server/                     # Express.js Backend API
│   ├── dbconfig/dbconfig.js    # Mongoose connection pool (deferred env check)
│   ├── models/                 # 10 Mongoose models
│   ├── routes/                 # 10 Express Router modules (35+ endpoints)
│   ├── lib/                    # 8 server utility modules
│   ├── index.js                # Express entry: CORS, routes, static serving, SPA fallback
│   ├── .env                    # Server secrets (MongoDB, Twilio, Razorpay, etc.)
│   └── package.json            # Server dependencies (express, mongoose, razorpay, etc.)
│
├── app/                        # (ORIGINAL) Next.js App Router — preserved, not deleted
├── components/                 # (ORIGINAL) Next.js components — preserved
├── lib/                        # (ORIGINAL) Next.js lib — preserved
├── public/                     # (ORIGINAL) Next.js public assets — preserved
└── conversion.md               # This file
```

---

## Migration Transformation Matrix

| Next.js Feature | React.js / MERN Replacement | Status |
| :--- | :--- | :---: |
| `next/image` (`<Image />`) | `<img />` with standard styling & lazy loading | ✅ Done |
| `next/link` (`<Link href="...">`) | `react-router-dom` (`<Link to="...">`) | ✅ Done |
| `next/navigation` (`useRouter`, `usePathname`, `useParams`) | `useNavigate`, `useLocation`, `useParams` from `react-router-dom` | ✅ Done |
| `next/dynamic` with `ssr: false` | `React.lazy` + `Suspense` | ✅ Done |
| Next.js App Router (`app/*/page.js`) | `client/src/pages/*.jsx` mounted via `Routes` in `App.jsx` | ✅ Done |
| Next.js Route Handlers (`app/api/*/route.js`) | Express.js routers in `server/routes/*.js` | ✅ Done |
| Next.js Server cookies (`cookies()`) | Express `req.cookies` via `cookie-parser` | ✅ Done |
| Next.js `req.json()` / `NextResponse.json()` | Express `req.body` & `res.status().json()` | ✅ Done |
| `next/font/google` | Google Fonts CDN `<link>` in `index.html` | ✅ Done |
| `process.env.NEXT_PUBLIC_*` | `import.meta.env.VITE_*` | ✅ Done |
| `"use client"` directives | Removed (all React components are client by default) | ✅ Done |
| Database & Models | Reused directly in `server/models` & `server/dbconfig` | ✅ Done |

---

## Detailed Task Breakdown & Checklist

### 1. Workspace Configuration & Setup
- [x] Client directory initialization (`client/`)
- [x] Server directory initialization (`server/`)
- [x] Client `package.json`, `vite.config.js`, `index.html`, `main.jsx`
- [x] Client environment variables (`.env` with `VITE_*`)
- [x] Server `package.json`, environment variables (`.env`)
- [x] Vite proxy configured (`/api` → `http://localhost:5000`)
- [x] Tracker file initialized (`conversion.md`)

### 2. Backend (Express.js Server)
- [x] DB Configuration: `server/dbconfig/dbconfig.js` (deferred env check)
- [x] Mongoose Models (10 files):
  - [x] `clean.js`, `contact.js`, `facial.js`, `newsletter.js`, `Order.js`
  - [x] `Otp.js`, `servicemodel.js`, `task.js`, `usermodel.js`, `Worker.js`
- [x] Server Libraries (`server/lib/` — 8 files):
  - [x] `firebase.js`, `generateInvoice.js`, `invoiceTemplate.js`, `mailer.js`
  - [x] `mongodb.js`, `supabase.js` (conditional init), `twilio.js`, `utils.js`
- [x] Express Route Handlers (`server/routes/` — 10 files, 35+ endpoints):
  - [x] `auth.js` → `/api/login`, `/api/signup`, `/api/logout`, `/api/me`, `/api/userexist`
  - [x] `otp.js` → `/api/send-otp`, `/api/verify-otp`, `/api/send-email-otp`, `/api/verify-email-otp`
  - [x] `services.js` → `/api/services`, `/api/service/:id`, cleaning, facial, event, review
  - [x] `orders.js` → `/api/orders`, `/api/orders/:orderId`, by-phone, cancel, add-addon
  - [x] `tasks.js` → `/api/tasks`, `/api/tasks/cancel`
  - [x] `payments.js` → `/api/razorpay`, `/api/save-order`
  - [x] `contact.js` → `/api/contact`, `/api/newsletter`
  - [x] `workers.js` → `/api/workers`, `/api/workers/rate`
  - [x] `invoice.js` → `/api/invoice/:orderId`
  - [x] `misc.js` → `/api/sendEmail`, `/api/test-upload`
- [x] Server entry (`index.js`): CORS, cookie-parser, JSON body parser, static serving, SPA fallback
- [x] Health check endpoint: `GET /api/health`

### 3. Frontend (React + Vite)
- [x] Static assets copied (`public/` — images, fonts, icons, manifest, sw.js)
- [x] `globals.css` → `client/src/index.css`
- [x] Client utilities (`client/src/lib/`): `firebase.js`, `utils.js`
- [x] Shared Components (`client/src/components/` — 24 files):
  - [x] `Navbar.jsx`, `BottomNav.jsx`, `Footer.jsx`
  - [x] `UserMap.jsx`, `GoogleMap.jsx`
  - [x] `FloatingCart.jsx`, `FloatingOrderTracker.jsx`
  - [x] `AboutSections.jsx`, `AssignedWorker.jsx`, `AvatarGroup.jsx`
  - [x] `bookingform.jsx`, `DateScroller.jsx`, `herocarosel.jsx`
  - [x] `InstallBanner.jsx`, `Loader.jsx`, `MyBookings.jsx`
  - [x] `OngoingTask.jsx`, `ProgressRing.jsx`, `ProjectCard.jsx`
  - [x] `PWAProvider.jsx`, `salemoving.jsx`, `salesection.jsx`
  - [x] `Toast.jsx`, `TopBar.jsx`
- [x] Page Components (`client/src/pages/` — 26 files):
  - [x] `HomePage.jsx` (from `app/page.js`)
  - [x] `BeautyPage.jsx` (from `app/beauty/page.js`)
  - [x] `BookingsPage.jsx` (from `app/bookings/page.jsx`)
  - [x] `CartPage.jsx` (from `app/cart/page.js`)
  - [x] `CheckoutPage.jsx` (from `app/checkout/page.js`)
  - [x] `CleanPage.jsx` (from `app/clean/page.js`)
  - [x] `ContactPage.jsx` (from `app/contact/page.js`)
  - [x] `DataDeletionPage.jsx` (from `app/data-deletion/page.jsx`)
  - [x] `EventDecorPage.jsx` (from `app/eventdecor/page.js`)
  - [x] `HautePage.jsx` (from `app/haute/page.js`)
  - [x] `HelpPage.jsx` (from `app/help/page.js`)
  - [x] `LocationPage.jsx` (from `app/location/page.js`)
  - [x] `LoginPage.jsx` (from `app/login/page.js`)
  - [x] `MapPage.jsx` (from `app/map/page.js`)
  - [x] `OnboardingPage.jsx` (from `app/onboarding/page.jsx`)
  - [x] `PrivacyPage.jsx` (from `app/privacy/page.js`)
  - [x] `RefundPage.jsx` (from `app/refund/page.js`)
  - [x] `RegisterPage.jsx` (from `app/register/page.js`)
  - [x] `ReviewPage.jsx` (from `app/review/[id]/page.js`)
  - [x] `ServicesPage.jsx` (from `app/services/page.jsx`) — redirects to `/beauty`
  - [x] `ServiceDetailPage.jsx` (from `app/services/[serviceName]/page.js`)
  - [x] `TermsPage.jsx` (from `app/t&c/page.js`)
  - [x] `TaskPage.jsx` (from `app/task/[id]/page.js` & `app/tasks/[id]/page.js`)
  - [x] `TrackPage.jsx` (from `app/track/[orderId]/page.jsx`)
  - [x] `UserPage.jsx` (from `app/user/page.js`)
  - [x] `NotFoundPage.jsx` (catch-all 404)
- [x] `App.jsx` with React Router, lazy loading, conditional Navbar/Footer, Toaster
- [x] `main.jsx` with BrowserRouter, service worker registration

### 4. Verification & Testing
- [x] All server files pass Node.js syntax check (`node --check`)
- [x] Client builds successfully with `vite build` (26 page chunks, 6.57s)
- [x] Server boots cleanly on port 5000
- [x] Supabase initialization gracefully skipped when credentials are placeholder
- [x] `dotenv/config` loads before all modules (no env race conditions)

---

## Bugs Fixed During Conversion

| # | Issue | Fix |
|---|-------|-----|
| 1 | `razorpay@^0.9.4` doesn't exist on npm | Changed to `^2.9.5` in `server/package.json` |
| 2 | `PWAProvider` missing default export | Added `export default PWAProvider` |
| 3 | `@/models/Worker` alias doesn't work in Node.js | Changed to `./Worker.js` relative import in `server/models/task.js` |
| 4 | `dotenv` not loaded before `dbconfig` checks env | Used `import "dotenv/config"` at top of `index.js`, deferred env check to `connects()` |
| 5 | Supabase crashes with placeholder URL `YOUR_SUPABASE_URL` | Made initialization conditional — returns `null` if credentials are placeholders |
| 6 | Stale `dotenv.config()` call after adding `import "dotenv/config"` | Removed redundant `dotenv.config()` line from `index.js` |
| 7 | Root `package.json` still had Next.js scripts & deps | Replaced with MERN scripts (`concurrently` for `npm run dev`) |
| 8 | `TaskPage.jsx` called `/api/tasks` as GET but server expects POST with email | Fixed to fetch user via `/api/me` first, then POST email to `/api/tasks` |
| 9 | `RegisterPage.jsx` sends `{ name }` but `auth.js` only accepted `{ username }` | Server now accepts both `name` and `username` |

---

## Backend ↔ Frontend Integration Audit ✅

> **Audited:** 2026-11-21 — All 33 internal `fetch()` calls verified against Express routes.

### Proxy Configuration
```js
// client/vite.config.js → all /api/* calls proxy to Express
server: { proxy: { '/api': { target: 'http://localhost:5000', changeOrigin: true } } }
```

### Endpoint Cross-Reference (33/33 match)

| # | Client File | Endpoint | Method | Server Route | Server File | ✓ |
|---|-------------|----------|--------|-------------|-------------|---|
| 1 | `Navbar.jsx` | `/api/me` | GET | `router.get("/me")` | `auth.js` | ✅ |
| 2 | `CartPage.jsx` | `/api/me` | GET | `router.get("/me")` | `auth.js` | ✅ |
| 3 | `CheckoutPage.jsx` | `/api/me` | GET | `router.get("/me")` | `auth.js` | ✅ |
| 4 | `ReviewPage.jsx` | `/api/me` | GET | `router.get("/me")` | `auth.js` | ✅ |
| 5 | `UserPage.jsx` | `/api/me` | GET | `router.get("/me")` | `auth.js` | ✅ |
| 6 | `MyBookings.jsx` | `/api/me` | GET | `router.get("/me")` | `auth.js` | ✅ |
| 7 | `TaskPage.jsx` | `/api/me` | GET | `router.get("/me")` | `auth.js` | ✅ |
| 8 | `LoginPage.jsx` | `/api/send-otp` | POST | `router.post("/send-otp")` | `otp.js` | ✅ |
| 9 | `LoginPage.jsx` | `/api/send-email-otp` | POST | `router.post("/send-email-otp")` | `otp.js` | ✅ |
| 10 | `LoginPage.jsx` | `/api/verify-otp` | POST | `router.post("/verify-otp")` | `otp.js` | ✅ |
| 11 | `LoginPage.jsx` | `/api/verify-email-otp` | POST | `router.post("/verify-email-otp")` | `otp.js` | ✅ |
| 12 | `RegisterPage.jsx` | `/api/signup` | POST | `router.post("/signup")` | `auth.js` | ✅ |
| 13 | `RegisterPage.jsx` | `/api/login` | POST | `router.post("/login")` | `auth.js` | ✅ |
| 14 | `UserPage.jsx` | `/api/logout` | POST | `router.post("/logout")` | `auth.js` | ✅ |
| 15 | `HomePage.jsx` | `/api/services` | GET | `router.get("/services")` | `services.js` | ✅ |
| 16 | `ServiceDetailPage.jsx` | `/api/services` | GET | `router.get("/services")` | `services.js` | ✅ |
| 17 | `TrackPage.jsx` | `/api/services` | GET | `router.get("/services")` | `services.js` | ✅ |
| 18 | `BeautyPage.jsx` | `/api/services/facial` | GET | `router.get("/services/facial")` | `services.js` | ✅ |
| 19 | `HautePage.jsx` | `/api/services/facial` | GET | `router.get("/services/facial")` | `services.js` | ✅ |
| 20 | `CleanPage.jsx` | `/api/services/cleaning` | GET | `router.get("/services/cleaning")` | `services.js` | ✅ |
| 21 | `EventDecorPage.jsx` | `/api/services/event` | GET | `router.get("/services/event")` | `services.js` | ✅ |
| 22 | `ReviewPage.jsx` | `/api/services/review` | POST | `router.post("/services/review")` | `services.js` | ✅ |
| 23 | `CheckoutPage.jsx` | `/api/orders` | POST | `router.post("/orders")` | `orders.js` | ✅ |
| 24 | `bookingform.jsx` | `/api/orders` | POST | `router.post("/orders")` | `orders.js` | ✅ |
| 25 | `TrackPage.jsx` | `/api/orders/:orderId` | GET | `router.get("/orders/:orderId")` | `orders.js` | ✅ |
| 26 | `HomePage.jsx` | `/api/orders/by-phone` | POST | `router.post("/orders/by-phone")` | `orders.js` | ✅ |
| 27 | `UserPage.jsx` | `/api/orders/by-phone` | POST | `router.post("/orders/by-phone")` | `orders.js` | ✅ |
| 28 | `MyBookings.jsx` | `/api/orders/by-phone` | POST | `router.post("/orders/by-phone")` | `orders.js` | ✅ |
| 29 | `TrackPage.jsx` | `/api/orders/add-addon` | POST | `router.post("/orders/add-addon")` | `orders.js` | ✅ |
| 30 | `TaskPage.jsx` | `/api/tasks` | POST | `router.post("/tasks")` | `tasks.js` | ✅ |
| 31 | `ContactPage.jsx` | `/api/contact` | POST | `router.post("/contact")` | `contact.js` | ✅ |
| 32 | `HelpPage.jsx` | `/api/contact` | POST | `router.post("/contact")` | `contact.js` | ✅ |
| 33 | `AssignedWorker.jsx` | `/api/workers/rate` | POST | `router.post("/workers/rate")` | `workers.js` | ✅ |

> `UserMap.jsx` calls the Google Maps Geocode API directly (external, not proxied) — works independently.

---

## How to Run

### Quick Start (Both servers with one command)
```bash
cd with-sparky
npm run dev
# → Express API on http://localhost:5000
# → Vite React on http://localhost:3000 (proxies /api → :5000)
```

### Manual Start (Separate terminals)

**Terminal 1 — Express API:**
```bash
cd with-sparky/server
node index.js
```

**Terminal 2 — Vite Dev Server:**
```bash
cd with-sparky/client
npx vite
```

### Production Mode (Single server)
```bash
# 1. Build the client
cd with-sparky
npm run build

# 2. Start the server (serves client/dist/ and API)
npm start
# → Both UI and API served from http://localhost:5000
```

### Available npm Scripts (root `package.json`)
| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | `concurrently server + client` | Start both servers together |
| `npm run server` | `node server/index.js` | Express API only |
| `npm run client` | `vite` | Vite dev server only |
| `npm run build` | `vite build` | Build client for production |
| `npm start` | `node server/index.js` | Production server |
| `npm run install:all` | `npm install` in client + server | Install all dependencies |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (SPA)                       │
│  React + Vite + React Router DOM + Framer Motion        │
│  ┌─────────────────────────────────────────────────┐    │
│  │  App.jsx                                        │    │
│  │  ├─ Navbar / BottomNav / Footer (conditional)   │    │
│  │  └─ <Routes> → 26 lazy-loaded page components   │    │
│  └─────────────────────────────────────────────────┘    │
│                        │ fetch('/api/...')               │
└────────────────────────┼────────────────────────────────┘
                         │
              ┌──────────▼──────────┐
              │   Vite Dev Proxy    │  (dev mode only)
              │  localhost:3000     │
              │  /api → :5000      │
              └──────────┬──────────┘
                         │
              ┌──────────▼──────────┐
              │   Express.js API    │
              │  localhost:5000     │
              │                    │
              │  10 route modules   │
              │  35+ endpoints      │
              │  cookie-parser      │
              │  CORS               │
              │  Static file serve  │
              │  SPA fallback       │
              └──────────┬──────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   ┌─────────┐    ┌───────────┐    ┌───────────┐
   │ MongoDB │    │  Twilio   │    │ Razorpay  │
   │ Atlas   │    │  SMS/OTP  │    │ Payments  │
   └─────────┘    └───────────┘    └───────────┘
        │
   ┌────┴────┐
   │ Supabase│  (optional — storage)
   └─────────┘
```

---

## Known Limitations / Notes

1. **Supabase** — Credentials are placeholder values. Features using Supabase storage will return errors until real credentials are configured in `server/.env`.
2. **Original Next.js files preserved** — The `app/`, `components/`, `lib/`, `public/` directories from the original Next.js app are still present and untouched.
3. **Google Maps API key** — Hardcoded in `client/index.html`. Move to `import.meta.env.VITE_GOOGLE_MAPS_KEY` for production.
4. **No SSR** — The React SPA does not have server-side rendering. SEO is handled via static meta tags in `index.html`.
5. **ES Modules** — Server uses `"type": "module"` throughout. All imports use `import/export` syntax.

---

## Status: ✅ CONVERSION COMPLETE

All Next.js pages, API routes, components, and utilities have been successfully migrated to the MERN stack architecture. Both client and server build/boot successfully.

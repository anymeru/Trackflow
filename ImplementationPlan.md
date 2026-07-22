# Implementation Plan — track-connect

Date: 2026-07-22

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                  Frontend (React + TS)           │
│  Landing │ Tracking Detail │ Admin │ Email Prev  │
│  ┌───────┴───────┐                              │
│  │ API Client     │  Socket.io Client            │
│  │ (Axios + JWT)  │  (real-time events)          │
│  └───────┬───────┘                              │
└──────────┼──────────────────────────────────────┘
           │ HTTP + WebSocket
┌──────────┼──────────────────────────────────────┐
│  Backend (Node.js + Express + TypeScript)        │
│  ┌───────┴───────┐  ┌──────────────────┐        │
│  │ REST API       │  │ Socket.io Server  │        │
│  │ (JWT auth)     │  │ (real-time push)  │        │
│  └───────┬───────┘  └──────────────────┘        │
│          │                                       │
│  ┌───────┴───────┐  ┌──────────────────┐        │
│  │ Prisma ORM     │  │ Services:         │        │
│  │ (PostgreSQL)   │  │ • Geocode (Nomin) │        │
│  └───────────────┘  │ • Routing (OSRM)   │        │
│                     │ • ETA calculation  │        │
│                     │ • Email (Nodemail) │        │
│                     │ • Position sim     │        │
│                     └──────────────────┘        │
└─────────────────────────────────────────────────┘
```

**Key decisions:**
- Backend: **Node.js + Express + TypeScript** (from scratch)
- Database: **PostgreSQL + Prisma ORM**
- Auth: **JWT tokens** (bcryptjs for password hashing)
- Geocoding: **Nominatim** (OpenStreetMap, free)
- Routing/distance: **OSRM** (OpenStreetMap, free)
- Real-time: **Socket.io** (WebSocket)
- Email: **Nodemailer + SMTP**
- Average speed assumption: **60 km/h** (configurable per-tracking)
- Position simulation: **Auto-advance on backend** + admin manual override
- Statuses: **8 statuses** — `in_transit`, `out_for_delivery`, `delivered`, `delayed`, `customs_hold`, `fees_pending`, `returned`, `lost`
- Dispute: **Independent entity** — not tied to tracking status, can be opened on any tracking

---

## Phase 1 — Backend

### 1a. Project scaffold

- New `server/` directory at repo root
- `package.json`, `tsconfig.json`, `.env.example`, `.gitignore`
- Dependencies:
  - Runtime: `express`, `cors`, `dotenv`, `jsonwebtoken`, `bcryptjs`, `zod`, `@prisma/client`, `socket.io`, `nodemailer`, `axios` (for Nominatim/OSRM calls), `node-cron`
  - Dev: `typescript`, `ts-node-dev`, `@types/express`, `@types/jsonwebtoken`, `@types/bcryptjs`, `@types/nodemailer`, `@types/cors`, `prisma`
- Folder structure:

```
server/
├── src/
│   ├── index.ts              # Entry point (Express + Socket.io setup)
│   ├── config/
│   │   └── env.ts            # Environment variables
│   ├── middleware/
│   │   ├── auth.ts           # JWT verification middleware
│   │   └── roles.ts          # Role-based access guard
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── trackings.ts
│   │   ├── messages.ts
│   │   ├── disputes.ts
│   │   ├── geocode.ts
│   │   └── notifications.ts
│   ├── services/
│   │   ├── geocode.ts        # Nominatim client
│   │   ├── routing.ts        # OSRM client
│   │   ├── eta.ts            # ETA calculation
│   │   ├── position.ts       # Position simulation
│   │   ├── email.ts          # Nodemailer + templates
│   │   └── status.ts         # Freeze/resume logic
│   ├── socket/
│   │   └── index.ts          # Socket.io event handlers
│   └── utils/
│       └── errors.ts         # Error classes + handler
├── prisma/
│   └── schema.prisma
└── templates/
    ├── status-change.html         # Generic: in_transit, out_for_delivery, delivered, delayed
    ├── customs-hold.html          # Blocked at customs + WhatsApp/Telegram contact
    ├── fees-pending.html          # Payment required + WhatsApp/Telegram contact
    ├── lost.html                  # Lost package + WhatsApp/Telegram contact
    ├── returned.html              # Returned to sender
    ├── dispute-opened.html        # Dispute confirmation
    └── dispute-resolved.html      # Dispute resolution
```

### 1b. Database schema (Prisma)

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      String   // admin | operator | client
  phone     String?
  createdAt DateTime @default(now())
  messages  Message[]
}

model Tracking {
  id                String   @id @default(uuid())
  trackingNumber    String   @unique
  clientName        String
  clientEmail       String
  packageDescription String?
  weight            Float?
  originLat         Float
  originLng         Float
  originAddress     String?
  destLat           Float
  destLng           Float
  destinationAddress String?
  currentLat        Float
  currentLng        Float
  status            String   // in_transit | out_for_delivery | delivered | delayed | customs_hold | fees_pending | returned | lost
  carrierRef        String?
  avgSpeedKmh       Float    @default(60)
  eta               DateTime?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  statusHistory StatusHistory[]
  messages      Message[]
  disputes      Dispute[]
}

model StatusHistory {
  id         String   @id @default(uuid())
  trackingId String
  tracking   Tracking @relation(fields: [trackingId], references: [id])
  oldStatus  String?
  newStatus  String
  reason     String?
  changedAt  DateTime @default(now())
}

model Message {
  id         String   @id @default(uuid())
  trackingId String
  tracking   Tracking @relation(fields: [trackingId], references: [id])
  senderId   String?
  sender     User?    @relation(fields: [senderId], references: [id])
  senderRole String   // admin | client
  body       String
  createdAt  DateTime @default(now())
}

model Dispute {
  id            String   @id @default(uuid())
  trackingId    String
  tracking      Tracking @relation(fields: [trackingId], references: [id])
  clientId      String?  // who opened the dispute
  reason        String   // damaged_package | lost_package | wrong_item | delivery_delay | other
  description   String
  status        String   // open | resolved
  adminResponse String?
  createdAt     DateTime @default(now())
  resolvedAt    DateTime?
}

// Dispute is an independent entity — not tied to tracking status.
// A client can open a dispute on any tracking regardless of its current status
// (e.g., package was delivered but wrong item received).
// Opening a dispute does NOT change the tracking status.

model NotificationLog {
  id              String   @id @default(uuid())
  trackingId      String
  recipientEmail  String
  type            String   // status_change | dispute_opened | dispute_resolved
  subject         String
  body            String
  sentAt          DateTime @default(now())
}
```

### 1c. Auth

- `POST /api/auth/register` — creates user with `client` role, returns JWT
- `POST /api/auth/login` — validates credentials, returns JWT + user (id, name, email, role)
- `GET /api/auth/me` — returns current user from JWT
- `auth` middleware: extracts + verifies JWT from `Authorization: Bearer <token>`
- `requireRole('admin')` middleware for role-gated endpoints
- JWT payload: `{ userId, role }`, expiry: 24h

### 1d. API endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/auth/register` | No | — | Register client account |
| POST | `/api/auth/login` | No | — | Login, returns JWT |
| GET | `/api/auth/me` | JWT | any | Current user info |
| GET | `/api/geocode` | JWT | admin | `?q=address` → `{lat, lng, displayName}` |
| GET | `/api/routing` | JWT | admin | `?origin=lat,lng&dest=lat,lng` → `{distanceKm, duration}` |
| GET | `/api/trackings` | JWT | any | List trackings (client sees own, admin sees all) |
| GET | `/api/trackings/public/:trackingNumber` | No | — | Public tracking lookup (no auth) |
| GET | `/api/trackings/:id` | JWT | any | Single tracking detail + history |
| POST | `/api/trackings` | JWT | admin | Create tracking (geocodes addresses, calculates ETA) |
| PATCH | `/api/trackings/:id/status` | JWT | admin/op | Change status (reason **required**) |
| PATCH | `/api/trackings/:id/position` | JWT | admin | Set position `{lat, lng}` or `{progressPercent}` |
| GET | `/api/trackings/:id/messages` | JWT | any | Messages (gated: only if delayed/customs_hold/fees_pending/lost) |
| POST | `/api/trackings/:id/messages` | JWT | any | Send message (gated by status) |
| GET | `/api/trackings/:id/disputes` | JWT | any | List disputes for tracking (independent of status) |
| POST | `/api/trackings/:id/disputes` | JWT | client | Open a dispute (does NOT change tracking status) |
| PATCH | `/api/disputes/:id/resolve` | JWT | admin | Resolve dispute (requires `adminResponse`) |
| GET | `/api/notifications/log` | JWT | admin | Paginated email notification history |
| GET | `/api/stats` | JWT | admin | Dashboard statistics |

### 1e. Geocoding service

- Uses **Nominatim** (`https://nominatim.openstreetmap.org/search?q=<query>&format=json&limit=1`)
- Rate limiting: 1 request/second (per Nominatim usage policy)
- Returns `{ lat, lng, displayName }`
- Called when admin creates tracking with address strings

### 1f. Routing service

- Uses **OSRM** public API (`https://router.project-osrm.org/route/v1/driving/{originLng},{originLat};{destLng},{destLat}?overview=false`)
- Returns `{ distanceKm, durationSeconds }`
- Used for ETA calculation

### 1g. ETA calculation

```
roadDistanceKm = osrmRoute(origin, destination).distanceKm
etaMs = roadDistanceKm / avgSpeedKmh * 3600000
eta = Date.now() + etaMs
```

- On **create**: ETA from origin → destination
- On **resume** (customs_hold/fees_pending/delayed → in_transit): ETA recalculated from current position → destination
- On **position override**: ETA recalculated from new position → destination
- Result stored as `DateTime` in the `Tracking.eta` field

### 1h. Position simulation

- Backend runs a `setInterval` every 10 seconds
- Only processes trackings where `status === "in_transit"` or `status === "out_for_delivery"`
- For each active tracking:
  1. Calculate remaining distance from current position to destination
  2. Calculate how much distance to cover in 10s based on `avgSpeedKmh`
  3. Interpolate new `(currentLat, currentLng)` along the route line
  4. Update database
  5. Emit `tracking:updated` via Socket.io
- Auto `out_for_delivery`: when remaining distance < 5 km (or progress ≥ 90%), system auto-switches `in_transit` → `out_for_delivery` (admin can also set manually)
- Auto `delivered`: when remaining distance < threshold → auto-set status to `delivered`

### 1i. Freeze/resume logic (status change service)

**Freezing statuses** (movement stops, ETA freezes):
- `delayed` — movement stops, ETA frozen, messaging active, WhatsApp/Telegram optional
- `customs_hold` — movement stops, ETA frozen, messaging active, WhatsApp/Telegram contact shown
- `fees_pending` — movement stops, ETA frozen, messaging active, WhatsApp/Telegram contact shown

**Terminal statuses** (movement ends permanently):
- `delivered` — position set to destination, ETA completed, green checkmark
- `returned` — position stays at last location, ETA cancelled
- `lost` — position stays at last location, ETA cancelled, messaging active, WhatsApp/Telegram shown

**Active movement statuses:**
- `in_transit` — position animates, ETA counts down
- `out_for_delivery` — position animates, ETA counts down (auto-triggered at 90% progress or set manually)

- **Status → `in_transit` (resume from freeze):**
  - Recalculate ETA: `now + distance(currentPos → dest) / avgSpeedKmh`
  - Add tracking back to active simulation set
  - Emit `tracking:updated` with new ETA via Socket.io

- **Status → `delivered`:**
  - Position simulation stops
  - Set `currentLat`/`currentLng` = destination
  - Emit `tracking:delivered` via Socket.io

### 1j. Email service (Nodemailer)

- SMTP config from env vars: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- Triggered by status changes (async, non-blocking)
- Email templates (HTML):
  - **Generic status change**: "Your package #TRK123 is now **{status}**" with current details
  - **Customs hold**: "Your shipment is blocked at customs" + instructions + **WhatsApp/Telegram admin contact** block
  - **Fees pending**: "Payment required for your shipment" + payment info + **WhatsApp/Telegram admin contact** block
  - **Delayed**: "Your shipment is delayed" + new estimated timeframe
  - **Delivered**: "Your package has been delivered" + delivery confirmation
  - **Lost**: "Your shipment has been marked as lost" + **WhatsApp/Telegram admin contact** block
  - **Returned**: "Your shipment is being returned to sender" + tracking details
  - **Dispute opened**: confirmation to client
  - **Dispute resolved**: resolution details
- All sent emails logged to `NotificationLog` table

### 1k. Socket.io

- Client connects to namespace `/tracking`
- Client joins room `tracking:<id>` after authenticating (or for public, via tracking number)
- Events emitted by server:
  - `tracking:updated` — `{ trackingId, status, currentLat, currentLng, eta }`
  - `tracking:frozen` — `{ trackingId, status, reason }` (for delayed, customs_hold, fees_pending)
  - `tracking:delivered` — `{ trackingId }` (final delivery)
  - `message:new` — `{ trackingId, message }`
  - `dispute:updated` — `{ trackingId, dispute }`
- Events received from admin client:
  - `position:set` — admin manually sets position

---

## Phase 2 — Frontend

### 2a. API service layer

```
src/
├── api/
│   ├── client.ts          # Axios instance with:
│   │                      #   - baseURL from env
│   │                      #   - JWT interceptor (Bearer token from localStorage)
│   │                      #   - 401 interceptor (clear token, redirect to /login)
│   ├── auth.ts            # login(), register(), getMe()
│   ├── trackings.ts       # getTrackings(), getTracking(), createTracking(),
│   │                      #   updateStatus(), updatePosition(), getPublicTracking()
│   ├── messages.ts        # getMessages(), sendMessage()
│   ├── disputes.ts        # getDisputes(), openDispute(), resolveDispute()
│   ├── geocode.ts         # geocodeAddress(query)
│   └── notifications.ts   # getNotificationLog(), getStats()
```

### 2b. Auth system

- `AuthContext` (React context):
  - `user: User | null`, `token: string | null`, `isLoading: boolean`
  - `login(email, password)` → calls API → stores token in `localStorage` + sets user
  - `logout()` → clears token + user, redirects to `/login`
  - `isAuthenticated`, `isAdmin`, `isOperator` derived booleans
- `useAuth()` hook
- `ProtectedRoute` component:
  - Checks `isAuthenticated`, redirects to `/login` if not
  - Optional `requiredRole` prop (e.g., `requiredRole="admin"`)
- `LoginPage.tsx` — replace mock logic with real API call
- `RegisterPage.tsx` — replace mock logic with real API call

### 2c. Status model migration

Replace all 11 statuses with the required 8:

| Code | Label | Color | Movement | Messaging | WhatsApp/Tg |
|------|-------|-------|----------|-----------|-------------|
| `in_transit` | En transit | Cyan (`#06B6D4`) | ✅ Animé | ❌ Désactivé | ❌ |
| `out_for_delivery` | En cours de livraison | Blue (`#3B82F6`) | ✅ Animé | ❌ Désactivé | ❌ |
| `delivered` | Livré | Green (`#22C55E`) | ❌ Terminé | ❌ Désactivé | ❌ |
| `delayed` | En retard | Amber (`#F59E0B`) | ❌ Figé | ✅ Actif | ⚠️ Optionnel |
| `customs_hold` | Bloqué en douane | Orange (`#F97316`) | ❌ Figé | ✅ Actif | ✅ Contact admin |
| `fees_pending` | Frais en attente | Red-amber (`#D97706`) | ❌ Figé | ✅ Actif | ✅ Contact admin |
| `returned` | Retourné | Purple (`#8B5CF6`) | ❌ Terminé | ❌ Désactivé | ❌ |
| `lost` | Perdu | Red (`#EF4444`) | ❌ Terminé | ✅ Actif | ✅ Contact admin |

Files to update:
- `src/data/mockData.ts` — update mock data or remove
- `src/components/tracking/StatusBadge.tsx` — map new statuses to colors/labels
- `src/components/operator/StatusChanger.tsx` — use new status list, make reason required
- `src/components/operator/OperatorFilters.tsx` — filter by new statuses
- `src/components/tracking/TrackingTimeline.tsx` — display new status labels
- `src/pages/TrackingDetailPage.tsx` — conditional sections based on new statuses
- `src/pages/AdminDashboard.tsx`, `src/pages/OperatorDashboard.tsx` — use new statuses

### 2d. Conditional messaging

In `src/pages/TrackingDetailPage.tsx`:

```
const MESSAGING_ENABLED_STATUSES = ["delayed", "customs_hold", "fees_pending", "lost"];

if (MESSAGING_ENABLED_STATUSES.includes(status)) {
  render <ChatBox active />
} else {
  render muted panel: "Le messaging est disponible lorsque votre envoi nécessite une attention particulière."
}
```

- `ChatBox` component: add `disabled` prop for the muted state
- Messages fetched from API via `useMessages()` hook (React Query)

### 2e. WhatsApp / Telegram contact buttons

- Visible only when `status === "customs_hold"` or `status === "fees_pending"` or `status === "lost"`
- Located in the right sidebar panel of `TrackingDetailPage`, above the chat
- Two buttons side by side:
  - WhatsApp icon (green) — "Contacter via WhatsApp"
  - Telegram icon (blue) — "Contacter via Telegram"
- Click handler: opens a dialog/modal:
  > "Ceci ouvrirait WhatsApp/Telegram avec le contact de l'admin : +237 XXX XXX XXX"
- Modal has a "Close" button
- Also optionally visible on `delayed` status at admin's discretion

### 2f. Dispute flow (independent entity)

Disputes are independent of tracking status. A client can open a dispute on any tracking, at any status (even `delivered` — e.g., wrong item received). Opening a dispute does NOT change the tracking status.

**Client side (TrackingDetailPage):**
- "Ouvrir un litige" button, visible on all statuses
- Opens dialog with:
  - Reason dropdown: `["Colis endommagé", "Colis perdu", "Mauvais article", "Retard de livraison", "Autre"]`
  - Free-text description textarea (required, min 10 chars)
  - Submit button
- On submit: `POST /api/trackings/:id/disputes` → dispute created (tracking status unchanged)
- Show success toast
- List of past disputes shown below (status: open/resolved)

**Admin side (AdminTrackingDetail):**
- Dispute panel listing all disputes for the tracking
- Each dispute shows: reason, description, status, date, client info
- Admin response textarea + "Résoudre le litige" button
- On resolve: `PATCH /api/disputes/:id/resolve` with `{ adminResponse: "..." }`
- Resolved disputes shown with response (read-only)
- Email notification sent to client on resolve

### 2g. Admin dashboard completion

**"Create New Tracking" button + form:**
- Primary CTA button at top of admin tracking list
- Opens dialog/route with form:
  - `clientName` (text input)
  - `clientEmail` (email input)
  - `packageDescription` (textarea)
  - `weight` (number input)
  - `originAddress` (text input with geocode on blur)
    - On blur: calls `GET /api/geocode?q=<address>`
    - Shows resolved lat/lng + preview on mini map
    - User can adjust by clicking map
  - `destinationAddress` (same geocode + map picker pattern)
  - `avgSpeedKmh` (number, default 60)
  - Submit → `POST /api/trackings`
  - On success: redirect to the new tracking's management view

**Per-tracking management view:**
- Click a tracking row → navigates to `/admin/trackings/:id`
- Or inline expandable panel
- Sections:
  1. **Map** with current position marker + route polyline + position slider
  2. **Status control**: dropdown of 8 statuses + **required reason text field** + update button
  3. **Message thread**: ChatBox (only active for delayed/customs_hold/fees_pending/lost statuses)
  4. **Dispute panel**: list all disputes (independent of status), respond, resolve
  5. **Info panel**: all tracking fields (read-only display)
  6. **Notification history**: emails sent for this tracking

**Notification log view:**
- Tab/route in admin panel: `/admin/notifications`
- Table: date, recipient email, type, subject, tracking number
- Filterable by type
- Click to expand full email body

### 2h. Map enhancements

**Animated marker:**
- In `TrackingMap.tsx`, add animation loop:
  - When `status === "in_transit"`, periodically fetch `GET /api/trackings/:id` (or listen to Socket.io `tracking:updated`)
  - On new position data, animate marker from old position to new position using Leaflet `setLatLng` with smooth interpolation over ~2s using `requestAnimationFrame`
- Use Framer Motion `AnimatePresence` for entry/exit transitions

**Freeze overlay:**
- When `status === "delayed"` or `status === "customs_hold"` or `status === "fees_pending"`:
  - Stop animation loop
  - Show overlay badge on map: "⏸ En attente — {reason}" (with status-specific icon)
  - Marker stays at last position
- When `status === "lost"` or `status === "returned"`:
  - Stop animation loop
  - Show overlay badge: "❌ {label}" (terminal state)
  - Marker stays at last known position

**Admin position control:**
- Slider input (0–100%) representing progress along the route
- Moving slider calls `PATCH /api/trackings/:id/position` with `{ progressPercent }`
- Server recalculates `currentLat`/`currentLng` + ETA, emits update via Socket.io
- Alternatively, "+5%" and "-5%" buttons

**Route rendering:**
- Fetch route polyline from OSRM on tracking creation
- Store waypoints or render polyline between origin → current → destination
- Use dashed line for pending route, solid for completed

### 2i. ETA display

In `ETABlock.tsx`:
- When `status === "in_transit"` or `status === "out_for_delivery"`: show countdown with progress bar (time elapsed vs total)
- When `status === "delayed"` or `status === "customs_hold"` or `status === "fees_pending"`: show frozen ETA with "⏸ En attente" label
- When `status === "delivered"`: show "Livré" with green checkmark
- When `status === "returned"` or `status === "lost"`: show "Annulé" with grey/red label

### 2j. Email preview page

- New route: `/email-preview`
- New component/page: `src/pages/EmailPreviewPage.tsx`
- Shows tabs for each email template type:
  - Status change: In Transit, Out for delivery, Delivered, Delayed
  - Customs hold (with WhatsApp/Telegram contact block)
  - Fees pending (with WhatsApp/Telegram contact block)
  - Lost (with WhatsApp/Telegram contact block)
  - Returned
  - Dispute Opened, Dispute Resolved
- Each tab renders the HTML template in an iframe or a styled container
- The customs hold / fees pending email templates show prominently:
  ```
  ┌──────────────────────────────────────────┐
  │  Votre colis #TRK-123 est BLOQUÉ EN DOUANE │
  │                                          │
  │  Contactez notre équipe support :        │
  │  📱 WhatsApp: +237 XXX XXX XXX          │
  │  ✈ Telegram: +237 XXX XXX XXX           │
  │                                          │
  │  Motif : Document douane manquant        │
  └──────────────────────────────────────────┘
  ```

### 2k. Visual palette fix

Update `tailwind.config.ts` and `src/index.css`:

| Token | Current (orange) | New (teal/cyan) |
|-------|-----------------|-----------------|
| `accent` | `hsl(25, 95%, 53%)` | `hsl(187, 85%, 53%)` or `#06B6D4` |
| `accent-foreground` | `0 0% 100%` | `0 0% 100%` |
| `ring` | `hsl(25, 95%, 53%)` | `hsl(187, 85%, 53%)` |
| `sidebar-primary` | `hsl(25, 95%, 53%)` | `hsl(187, 85%, 53%)` |

Status semantic colors:
- `in_transit` → teal/cyan (`#06B6D4`)
- `out_for_delivery` → blue (`#3B82F6`)
- `delivered` → green (`#22C55E`)
- `delayed` → amber (`#F59E0B`)
- `customs_hold` → orange (`#F97316`)
- `fees_pending` → red-amber (`#D97706`)
- `returned` → purple (`#8B5CF6`)
- `lost` → red (`#EF4444`)

Typography: Add `JetBrains Mono` to Google Fonts import in `index.html`, apply to tracking numbers and timestamps.

### 2l. Remove mock data & connect to API

- All pages and components switch from `import { mockTrackings } from "../data/mockData"` to React Query hooks:

```typescript
// src/hooks/useTrackings.ts
export function useTrackings() {
  return useQuery({
    queryKey: ["trackings"],
    queryFn: () => trackingsApi.getTrackings(),
  });
}

export function useTracking(id: string) {
  return useQuery({
    queryKey: ["trackings", id],
    queryFn: () => trackingsApi.getTracking(id),
  });
}

export function useUpdateStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, reason }) =>
      trackingsApi.updateStatus(id, { status, reason }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["trackings", id] });
      queryClient.invalidateQueries({ queryKey: ["trackings"] });
    },
  });
}
```

- `mockData.ts` can be kept as test fixtures or removed
- All Socket.io events handled via `useSocket()` hook that updates React Query cache

---

## Phase 3 — Verification

1. `npm run build` (frontend) — must pass
2. `npm test` (frontend) — must pass
3. `npm run build` (backend) — must pass
4. End-to-end flow test:
   - Admin creates tracking with addresses → geocoding resolves → ETA calculated
   - Client views tracking detail → live map with animated marker
   - Position reaches 90% → auto-switches to "En cours de livraison"
   - Admin changes status to "Bloqué en douane" → map freezes, ETA freezes, email sent with WhatsApp/Telegram contact
   - Client sees "Contact via WhatsApp" button, messaging enabled
   - Client opens dispute (independent) → dispute created, tracking status unchanged
   - Admin responds and resolves dispute → email sent to client
   - Admin resumes to "En transit" → ETA recalculated, movement resumes from frozen point
   - Position reaches destination → auto-switches to "Livré"

---

## Execution order (recommended)

| Step | Description | Depends on |
|------|-------------|-----------|
| 1 | Backend scaffold + Prisma schema + DB migration | — |
| 2 | Auth endpoints + middleware | 1 |
| 3 | Geocoding + routing + ETA services | 1 |
| 4 | Trackings CRUD endpoints | 2, 3 |
| 5 | Status change + freeze/resume + position sim | 4 |
| 6 | Messages + Disputes endpoints | 4 |
| 7 | Socket.io setup | 4 |
| 8 | Email service + templates + notification log | 5 |
| 9 | Frontend API layer + AuthContext + ProtectedRoute | — |
| 10 | Status model migration | — |
| 11 | Create tracking form (admin) | 9 |
| 12 | Per-tracking admin management view | 9, 11 |
| 13 | Map animation + position control | 12 |
| 14 | ETA display freeze/resume | 13 |
| 15 | Conditional messaging | 9 |
| 16 | WhatsApp/Telegram buttons | 9 |
| 17 | Dispute flow (client + admin) | 9 |
| 18 | Email preview page | 9 |
| 19 | Notification log (admin) | 9 |
| 20 | Visual palette fix + JetBrains Mono | — |
| 21 | Remove mock data, wire React Query | 9–20 |
| 22 | Build + test verification | 21 |

Steps 1–8 are backend-only (can be worked independently from frontend).
Steps 9–20 are frontend-only (can be built in parallel after API contract is agreed).
Steps 21–22 are integration.

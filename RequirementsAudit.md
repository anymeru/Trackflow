# Requirements Audit

Date: 2026-07-22

Verdict: the app does not meet all requirements in `REquirements.md`.

The project builds and presents a credible React/Tailwind/shadcn tracking demo, but several core requirements are missing, mocked, or only loosely approximated.

## What Passes

- Uses React + TypeScript.
- Uses Tailwind CSS and shadcn/ui components.
- Uses Leaflet with OpenStreetMap tiles.
- Uses Framer Motion in parts of the UI.
- Supports light and dark mode.
- Provides a landing page with tracking-number entry.
- Provides tracking detail pages with map, ETA, shipment information, and timeline sections.
- Provides client, operator, and admin dashboard routes.
- Provides a chat/message UI.
- Provides mock notification data and an in-app notification dropdown.

## Verification

- `npm run build` passes.
- `npm test` passes.
- Test coverage is minimal: only one example Vitest test currently runs.

## Major Gaps

### Supabase

The app does not integrate Supabase for auth, database, or realtime updates.

Evidence:

- Auth is mocked in `src/pages/LoginPage.tsx`.
- App data is loaded from `src/data/mockData.ts`.
- No Supabase client/config was found in the source tree.

### Protected Admin Login

The admin area is not actually gated behind Supabase auth.

Evidence:

- `/admin` is registered as a normal route in `src/App.tsx`.
- `LoginPage` routes users based on whether the email contains `admin`, `operator`, or `support`.

### Required Status Model

The required status model is not implemented.

Required statuses:

- In Transit
- Paused
- Suspended
- Delivered
- Dispute Opened

Current statuses include:

- `created`
- `picked_up`
- `in_transit`
- `out_for_delivery`
- `delivered`
- `delayed`
- `lost`
- `customs_hold`
- `fees_pending`
- `fees_paid`
- `returned`

This means the app cannot correctly support the required paused/suspended/dispute workflows.

### Conditional Messaging

Messaging is not gated by shipment status.

Requirement:

- Messaging should only be rendered/enabled for `Paused`, `Suspended`, or `Dispute Opened`.
- Otherwise, the app should show a muted disabled panel.

Current behavior:

- `TrackingDetailPage` always renders the chat panel.

### WhatsApp / Telegram Contact Flow

The required WhatsApp/Telegram admin-contact buttons are missing.

Requirement:

- Buttons should appear during `Suspended` or `Dispute Opened` states.
- Buttons should open a mocked modal explaining that WhatsApp/Telegram would open with the admin contact.

Current behavior:

- Existing WhatsApp behavior is only in sharing, not the required admin-contact flow.

### Dispute Flow

The required "Open a Dispute" workflow is missing.

Requirement:

- Button opens a form with reason dropdown and free-text description.
- Submit updates status to `Dispute Opened`.
- Submit notifies admin in the back office.

Current behavior:

- There are incident and return-related components, but not the required dispute lifecycle.

### Email Preview Demo Page

The separate email preview page is missing.

Requirement:

- A dedicated "Email Preview" page with sample notification templates.
- Especially a suspended-status email with prominent WhatsApp/Telegram admin contact.

Current behavior:

- No email-preview route exists in `src/App.tsx`.
- No email preview page/component was found.

### Admin Dashboard

The admin dashboard is incomplete relative to the requirements.

Missing required admin features:

- Active tracking table with required columns.
- Quick filters by status in the admin panel.
- "Create New Tracking" primary button.
- Create tracking form.
- Origin and destination map pickers.
- ETA auto-calculation from route/distance.
- Per-tracking management view.
- Manual position advance/set controls.
- Required reason field for status changes.
- Persisted status history with reasons shown to clients.
- Message thread limited to gated statuses.
- Dispute panel with admin response and resolve/close action.
- Notification log view.

Current behavior:

- `src/pages/AdminDashboard.tsx` mainly provides analytics, users, a simple tracking list, and a global map.

### Operator Status Change

The operator status changer is not requirement-complete.

Current behavior:

- Status changes only show a toast and optionally call an in-memory callback.
- The reason/comment field is optional.
- It does not persist status history.
- It does not freeze or resume map position/ETA.
- It does not use the required statuses.

Evidence:

- `src/components/operator/StatusChanger.tsx`

### Map Behavior

The map is static rather than fully live/simulated.

Requirement:

- Animated marker moving along a route polyline.
- Admin control to manually advance/set position along route.
- Paused/Suspended freezes map position and ETA countdown.
- Returning to In Transit resumes from the frozen point.

Current behavior:

- `TrackingMap` renders Leaflet markers and a route polyline from mock positions.
- No animated marker movement was found.
- No admin position controls were found.

### Shipment Information

The shipment information panel is incomplete.

Requirement:

- Sender/recipient masked or partial for privacy.
- Package description.
- Weight.
- Origin and destination cities.
- Carrier reference number.

Current behavior:

- Shows origin, destination, carrier, ETA, and optional telemetry.
- Sender/recipient masking and weight are not represented in the current data model.

### Data Model

The suggested Supabase tables are not implemented.

Required/suggested tables:

- `trackings`
- `status_history`
- `messages`
- `disputes`

Current behavior:

- Uses TypeScript interfaces and mock arrays in `src/data/mockData.ts`.

### Visual Design

The app is generally polished, but the palette does not fully match the requirement.

Requirement:

- Deep navy/indigo primary.
- Vivid teal/cyan accent.
- Semantic colors for statuses.

Current behavior:

- The app uses navy-like primary colors.
- The main accent is orange, not teal/cyan.
- The `in_transit` map/status styling also uses orange in places.

## Overall Assessment

The app is a functional and visually decent mock tracking dashboard, but it is not an end-to-end implementation of the requested package tracking platform.

It currently satisfies part of the front-office demo shell and some dashboard presentation requirements. It does not satisfy the most important behavioral requirements around Supabase-backed auth/data, realtime status/messages, admin tracking creation/management, dispute handling, conditional messaging, WhatsApp/Telegram contact demo, email previews, and notification logs.


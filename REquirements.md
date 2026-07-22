Context & Purpose

Build a package tracking web platform with a Front Office (client-facing) and Back Office (admin panel).  

---

Tech Stack

- React + TypeScript

- Tailwind CSS + shadcn/ui components

- Supabase for auth, database, and real-time updates (tracking status, messages)

- A map library (Mapbox GL JS or Leaflet with OpenStreetMap tiles) for live position rendering

- Framer Motion for subtle transitions (status changes, map marker movement, message send/receive)

---

Visual Design Direction

Modern, trustworthy, logistics/fintech aesthetic — this needs to look credible, since the whole point of the demo is showing how convincing the pattern appears.

Typography:

- Headings: `Space Grotesk` or `Sora` (geometric, confident, modern-tech feel)

- Body: `Inter` (clean, highly legible at small sizes for status details, timestamps)

- Monospace accent for tracking numbers and timestamps: `JetBrains Mono`

Color palette:

- Primary: deep navy/indigo (`#1E293B` – `#312E81` range) — conveys logistics/enterprise trust

- Accent: a vivid teal or cyan (`#06B6D4` / `#14B8A6`) for active/in-transit states and CTAs

- Status colors (semantic, consistent across app):

  - In Transit → cyan/blue

  - Delivered → green (`#22C55E`)

  - Paused/Suspended → amber (`#F59E0B`)

  - Dispute/Alert → red (`#EF4444`)

- Neutral surfaces: soft off-white (`#F8FAFC`) light mode background, slate (`#0F172A`) for dark mode

- Support both light and dark mode

Layout feel: Card-based dashboards, generous whitespace, rounded-xl corners, soft shadows, subtle glassmorphism on overlays (map controls, modals). Think Stripe Dashboard × DHL tracking page.

---

FRONT OFFICE (Client-Facing)

1. Landing / Tracking Entry

- Clean hero section with a single prominent input: "Enter your tracking number"

- On submit, route to the Tracking Detail view

2. Tracking Detail Page

- Live map (Mapbox/Leaflet) showing an animated marker representing package position, moving along a route polyline from origin to destination

- Status card: current status (In Transit / Paused / Suspended / Delivered / Dispute Opened), last updated timestamp

- ETA card: estimated arrival date/time, calculated from origin, destination, and current progress

- Shipment info panel: sender/recipient (masked/partial for privacy), package description, weight, origin & destination cities, carrier reference number

- Timeline/history component: vertical timeline of all past status changes with timestamps

- Conditional messaging panel:

  - Only rendered/enabled when status is one of: `Paused`, `Suspended`, `Dispute Opened`

  - Shows a simple chat UI (message bubbles, timestamp, "Admin" vs "You" labeling)

  - When disabled (e.g. status = In Transit or Delivered), show a muted panel: "Messaging is available when your shipment requires attention."

- "Contact via WhatsApp / Telegram" buttons:

  - Visible specifically during Suspended/Dispute states

  - Styled as buttons with platform icons, opening a mocked modal (not a real deep link) showing "This would open WhatsApp/Telegram with the admin's contact" for demo purposes

- "Open a Dispute" button: opens a form (reason dropdown + free-text description), submits and updates status to "Dispute Opened," notifies admin (in back office)

3. Email Notification Mockups

- Include a separate "Email Preview" demo page showing sample notification templates the user would receive on status change (styled HTML email mockup, not actually sent) — especially the Suspended-status email that includes the admin's WhatsApp/Telegram contact prominently. This is a key artifact for your client walkthrough.

---

BACK OFFICE (Admin Panel)

Gate behind a simple Supabase-auth admin login.

1. Dashboard

- Table/list of all active trackings: tracking number, client name, current status, origin → destination, last update

- Quick filters by status

- "Create New Tracking" primary button

2. Create Tracking Flow

- Form fields: client name, client email, package description, origin location (with map picker), destination location (with map picker), carrier/tracking number (auto-generated or manual)

- On submit: system auto-calculates ETA (based on distance/route) and initializes tracking at "In Transit" with position at origin

3. Tracking Management View (per tracking)

- Map showing current simulated position, with an admin control to manually advance/set position along the route (simulating movement over time)

- Status control: dropdown/buttons to set status (In Transit / Paused / Suspended / Delivered / Dispute Opened)

  - Changing to Paused/Suspended freezes the map position and ETA countdown

  - Changing back to In Transit resumes from where it left off (not reset)

- Reason field: required short text field admin fills when changing status (e.g. "Customs fee pending") — this is stored and shown in the client's timeline

- Message thread: admin can view and reply to client messages, only visible/active for the gated statuses

- Dispute panel: list of open disputes with client's stated reason, admin response field, resolve/close action

4. Notification Log

- A log view showing every simulated email notification sent (status, timestamp, recipient) — useful for demo purposes, to show the client exactly how the "email + WhatsApp/Telegram contact" push works structurally.

---

Data Model (Supabase tables, suggested)

- `trackings`: id, tracking_number, client_name, client_email, package_description, origin_lat/lng, destination_lat/lng, current_lat/lng, status, eta, created_at, updated_at

- `status_history`: id, tracking_id, old_status, new_status, reason, changed_at

- `messages`: id, tracking_id, sender (admin/client), body, created_at

- `disputes`: id, tracking_id, reason, description, status (open/resolved), admin_response, created_at

---

Deliverable Notes

Please make sure clean, professional visuals are fully functional end-to-end, since this will be presented live to a client as a demonstration before proposing a safer redesign.
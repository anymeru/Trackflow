# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Admins** (primary) — system administrators who manage users, configure settings, oversee all operations, and have full command of the tracking ecosystem.
- **Clients** — business customers who ship items and need to track their shipments, manage deliveries, and contact support.
- **Operators** — internal team who manage tracking statuses, handle client inquiries, and update shipment events.

## Product Purpose

A real-time tracking platform for packages, vehicles, and assets with integrated messaging. TRACE gives shippers, operators, and administrators complete visibility into every shipment's journey — from pickup to proof of delivery — with live tracking, accurate ETAs, and a transparent support channel.

## Positioning

TRACE combines enterprise-grade tracking infrastructure with a polished, dark-first interface that makes shipment visibility feel effortless. Unlike black-box carrier portals, TRACE surfaces every status change, location update, and ETA confidence score in a clean, real-time dashboard.

## Operating Context

- The back-office is used daily on desktop (primary) and mobile (secondary) by admins managing 50K+ shipments/year across 120+ countries.
- Clients access their dashboard to check shipment status, view timelines and maps, and message support.
- Operators work through a dedicated view to manage all active trackings and respond to client inquiries.
- Public tracking pages are shared with end-recipients who are not logged in.
- Multi-tracking search allows looking up multiple tracking numbers at once.

## Capabilities and Constraints

Confirmed:
- Real-time tracking with map, timeline, and ETA blocks
- Multi-tracking public search (up to 10 numbers)
- Status badge system (active, in transit, delayed, pending, delivered, etc.)
- Role-based dashboards: client, operator, admin
- Messaging/support system per tracking
- User management (admin only)
- Settings panel (admin only, including app name, support email, position simulation)
- Notification dropdown and theme toggle
- Light/dark mode with CSS variable system
- Recent trackings stored in localStorage
- Public tracking page (no auth required)
- Landing, about, contact pages (no auth required)
- Mock data system for development

Terminology: tracking, shipment, ETA, waypoint, status, carrier, proof of delivery, incident.

## Brand Commitments

- Name: **TRACE**
- Tagline: **"Everything in view."**
- Primary accent: Cyan Signal #00B4D8
- Secondary: Coral Pin #FF6B6B (alerts, delays, location markers)
- Secondary: Mint #4ECDC4 (success, completed routes)
- Background: Dark #111111 / #121212
- Text: Warm White #F5F5F5
- Type: Inter (system-ui) primary, SF Mono / Cascadia Code for monospace
- Dark-first identity with a tracking-signal visual language (route lines, waypoints, signal paths, location pins)
- Logo: T-mark (cyan rounded square with white "T", route cutout, and coral tracking pin)

## Evidence on Hand

- Brand guidelines board: `/public/trace-brand-board.svg` (color system, typography, logo construction, application mockups)
- Logo SVG: `/public/trace-logo.svg`
- Existing implementation with full component library, routing, and mock data
- No real customer testimonials, case studies, or press assets in the codebase

## Product Principles

1. **Visibility first** — every surface, role, and interaction exists to make shipment status transparent. If a design obscures information, it fails.
2. **Role-appropriate density** — admins need power and data density; operators need scanability and action speed; clients need clarity and reassurance. Adapt density and hierarchy per role without breaking consistency.
3. **Dark-first, not dark-only** — the dark theme is the authored experience; light mode is a respectful translation, not an afterthought.
4. **Movement has meaning** — status changes, location updates, and routing signals animate to draw attention, but the interface stays calm under normal operation.
5. **Unseen details compound** — every pixel, timing curve, and spacing decision serves the aggregate feeling of a tool that is precise, trustworthy, and effortless to use.

## Accessibility & Inclusion

- Light/dark mode support
- The brand's high-contrast palette (white text on dark backgrounds) provides good readability
- No product-specific accessibility standard is currently declared

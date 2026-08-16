# AuraEvent — Viva Preparation

## Architecture Explanation (say this in your own words)

AuraEvent is a React + Vite single-page app. `App.jsx` sets up three route groups with `react-router-dom`:
public routes (landing, login, register, docs), a student layout, and an admin layout. Student and admin
routes are wrapped in a `ProtectedRoute` component that checks the logged-in user's role from `AuthContext`
and redirects if they're not allowed — that's the client-side guard.

Every page talks to a **service layer**, not to the database directly: `authService`, `eventService`,
`registrationService`, `announcementService` in `src/services/database.js`. Each service function checks one
flag — `isSupabaseConfigured` — and either calls the real Supabase client or a LocalStorage mock with the
exact same function signature. That's the database abstraction: the UI never knows or cares which one is
active, and the business rules (capacity, deadline, duplicate registration) are written once per provider but
enforce identical outcomes.

For real production security, the client-side route guard is a UX nicety, not the actual defense — the real
enforcement is Supabase Row Level Security policies on the `events`, `registrations`, and `announcements`
tables, which check `role = 'admin'` server-side regardless of what the frontend does.

QR tickets: on successful registration, a JSON payload (user id, event id, timestamp) is stored as `qr_data`
on the registration row, then rendered client-side as an SVG with `react-qr-code` — no external QR API call
needed.

Analytics: Recharts reads the same `registrationService`/`eventService` data and aggregates it client-side
into bar (registrations per event), pie (category split), and line (registrations over time) charts.

Deployment: Vite builds a static `dist/` bundle, pushed to GitHub, deployed on Vercel. Because it's a
client-side-routed SPA, `vercel.json` rewrites every path to `index.html` so a direct load of `/docs` doesn't
404 at the server before React Router ever runs.

## 10 Viva Questions & Answers

**1. Why React?**
Component reusability fit a UI with three distinct areas (student, admin, docs) sharing a lot of pieces —
`EventCard`, `Navbar`, `Toast` — and React's ecosystem (React Router, Recharts) covered every other
requirement without custom-building routing or charting.

**2. Why Vite over Create React App?**
Vite's dev server uses native ES modules, so startup and hot-reload are near-instant even as the page count
grew; CRA's webpack-based bundling gets noticeably slower as a project scales.

**3. Why Supabase?**
It gives Postgres, authentication, and row-level security out of the box without running a separate backend
server — appropriate for a student project's scope, while still being real production infrastructure.

**4. Why PostgreSQL specifically?**
The data is inherently relational — a registration is a join between a student and an event with a uniqueness
constraint — which maps cleanly to foreign keys and a `unique(user_id, event_id)` constraint, which a
NoSQL store would have to hand-enforce in code.

**5. Why keep a LocalStorage fallback instead of requiring Supabase?**
So the project can be graded or demoed with zero setup and no risk of an expired free-tier database being
unreachable during a viva — `npm install && npm run dev` just works.

**6. How is Admin protected?**
Two layers: `ProtectedRoute` redirects any non-admin session away from `/admin/*` in the UI, and Supabase RLS
policies on every table independently check `role = 'admin'` before allowing writes — so even a forged
request that skips the frontend entirely is still rejected by the database.

**7. How do you prevent duplicate registrations?**
A `unique(user_id, event_id)` constraint at the database level, plus a pre-check in
`registrationService.register()` that looks for an existing `Registered` row before inserting — belt and
braces, so it's enforced even under the LocalStorage fallback which has no real DB constraints.

**8. How is capacity enforced?**
Before inserting a registration, the service counts existing `Registered` rows for that event and compares
against `event.capacity`; if the count has reached capacity, it throws before any write happens.

**9. How does the QR ticket work end-to-end?**
On successful registration, a JSON string identifying the user, event, and timestamp is saved as `qr_data` on
the registration row. `MyRegistrations.jsx` renders that string through `react-qr-code`, which draws it as an
SVG entirely in the browser — no network round-trip to a QR-generation API.

**10. What happens if Supabase goes offline / how would you scale this for a real college?**
Today, if Supabase is unreachable the app doesn't silently fail over mid-session — the mode is chosen once at
startup based on whether credentials are present. For a real deployment I'd add a runtime health check with
a manual retry, plus caching of the event list so a brief outage doesn't blank the page. To scale to a whole
college: add pagination on the events list, move CSV export to a server function for large rosters, add Redis
caching in front of frequently-read tables, and split Auth roles more granularly (e.g. department-level
admins) using more specific RLS policies.

## 3-Minute Live Demo Script

**0:00–0:20 — Introduce**
"This is AuraEvent, a college event management system. Students discover and register for events with
automatic capacity and deadline checks, and get an instant QR ticket. Admins manage everything from one
dashboard."

**0:20–1:00 — Student Portal**
Open the live URL → show the landing page → click into Events → demonstrate search and category filter.

**1:00–1:30 — Register + QR**
Open an event, click Register, then go to My Tickets and show the generated QR pass — mention it's an SVG
rendered client-side.

**1:30–2:10 — Admin Dashboard**
Log out, log in as admin → show the dashboard stats → open Analytics and point out the three charts.

**2:10–2:30 — Event management + CSV**
Create or edit an event → open Participants → filter by event/department → click Export CSV.

**2:30–2:45 — Docs**
Open `/docs`, click through two or three sections (e.g. ER Diagram, Test Matrix).

**2:45–3:00 — Architecture + deployment**
"It's a React/Vite SPA with a database abstraction layer over Supabase Postgres, with a LocalStorage fallback
for offline grading. It's deployed on Vercel over HTTPS, connected to GitHub for continuous deployment."

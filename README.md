# AuraEvent — College Event Management System

## Project Overview

AuraEvent centralizes college event discovery, registration, ticketing, and administration into a single portal.
Students browse and register for events with automatic capacity, deadline, and duplicate-entry validation and
receive an instant SVG QR entry pass. Admins manage the event catalog, participant rosters, announcements, and
view live participation analytics.

## Problem Being Solved

Event registration at most colleges is scattered across paper forms, spreadsheets, and chat groups, leading to
overbooking, missed deadlines, and no consolidated view for organizers. AuraEvent solves this with one
role-based portal backed by consistent business-rule enforcement.

## Features

### Student Portal
- Browse, search, and filter events by keyword and category
- Real-time seat availability
- Registration blocked automatically on: full capacity, passed deadline, or duplicate entry
- Instant SVG QR entry pass, printable/downloadable
- View and cancel active tickets
- Announcements feed with priority labels

### Admin Portal
- Protected dashboard (route-guarded, role-checked)
- Full event CRUD (create, edit, delete, publish)
- Participant roster with event/department filters
- One-click CSV roster export
- Priority-labeled announcement broadcasting

### Analytics
- Registrations per event (bar chart)
- Category distribution (pie chart)
- Registration timeline (line chart)

### QR Tickets
Each registration is stored with a unique `qr_data` payload rendered as an SVG QR code via `react-qr-code`,
with dedicated print styling for a clean physical pass.

### Documentation
An in-app `/docs` explorer containing the Problem Statement, Objectives, Scope, SRS, Use Case Diagram, Context
DFD, Level 1 DFD, ER Diagram, Class Diagram, Activity Diagram, Sequence Diagram, WBS, Gantt Chart, Risk
Mitigation, and Test Matrix.

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Icons | Lucide React |
| Charts | Recharts |
| QR Codes | react-qr-code (SVG) |
| Database / Auth | Supabase (PostgreSQL + Auth), with LocalStorage fallback |

## System Architecture

```text
React UI (Student / Admin / Docs)
        │
Application Services  (authService, eventService, registrationService, announcementService)
        │
Database Abstraction   (src/services/database.js)
   ├── Supabase PostgreSQL   (when VITE_SUPABASE_URL / ANON_KEY are set)
   └── LocalStorage fallback (src/services/localDb.js — used automatically otherwise)
```

Pages never call Supabase or `localStorage` directly — they call the service layer in
`src/services/database.js`, which enforces capacity/deadline/duplicate rules identically for both providers.

## Database Architecture

Tables (see `supabase_schema.sql`): `profiles`, `events`, `registrations` (unique constraint on
`user_id, event_id` to prevent duplicates), `announcements`. Row Level Security is enabled on every table —
admin-only writes are enforced by a `role = 'admin'` policy check, not just hidden UI.

## Authentication

- **Supabase mode**: `supabase.auth` email/password, with a `profiles` row auto-created via a `handle_new_user`
  trigger.
- **Local mode**: a mock `localStorage`-backed auth service with the same interface, pre-seeded with the demo
  accounts below.

Admin routes are protected two ways: client-side (`ProtectedRoute` redirects unauthenticated/wrong-role users)
**and** server-side (Supabase RLS policies), so a student cannot bypass protection just by typing `/admin/...`
in the address bar.

## LocalStorage Fallback

If `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are not set, the app runs entirely on a LocalStorage mock
database — pre-seeded with 8 sample events and 2 demo accounts — so it's fully functional out of the box for
grading with zero setup.

## Project Structure

```text
src/
├── components/     Navbar, Sidebar, ProtectedRoute, Toast, EventCard
├── context/        AuthContext (global session state)
├── pages/
│   ├── student/    Dashboard, Events, EventDetails, MyRegistrations, Announcements, Profile
│   ├── admin/      Dashboard, ManageEvents, EventForm, ManageParticipants, ManageAnnouncements, Analytics
│   └── Docs.jsx    SE/PM documentation explorer
├── services/       supabaseClient.js, localDb.js, database.js (abstraction layer)
└── App.jsx         Routing: public / student / admin layouts
```

## Installation

```bash
npm install
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase project's public credentials (optional — omit to run
in Local Mock Mode):

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Never put the Supabase **service-role** key here — only the public anon key is safe for a frontend app.

## Running Locally

```bash
npm run dev
```

## Production Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the exact step-by-step GitHub + Vercel + Supabase deployment
runbook, including the SPA rewrite config (`vercel.json`) that prevents `/docs`, `/admin`, etc. from 404ing on
direct load.

```bash
npm run build   # outputs to dist/
```

## Live Demo

Live Demo: [DEPLOYED URL]

## GitHub Repository

Repository: [github.com/projecttgppp001-cmd/aura-event](https://github.com/projecttgppp001-cmd/aura-event)

## Project Contact

Email: [projecttgppp001@gmail.com](mailto:projecttgppp001@gmail.com)  
GitHub: [projecttgppp001-cmd](https://github.com/projecttgppp001-cmd)

## Demo Accounts (Local Mock Mode)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@college.edu` | `admin123` |
| Student | `student@college.edu` | `student123` |

## Testing

See the Test Matrix section of `/docs` in-app, and `DEPLOYMENT.md` for the full manual production test
checklist (student flow, admin flow, direct-route access, responsive check).

## Future Enhancements

- Payment integration for paid events
- On-site QR check-in scanner
- Email/SMS notifications for registration and reminders
- Multi-college / multi-tenant support

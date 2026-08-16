import React, { useState } from 'react'
import { FileText } from 'lucide-react'

const SECTIONS = [
  {
    id: 'problem', label: 'Problem Statement',
    body: `Colleges run dozens of events every semester — hackathons, workshops, fests, seminars — but registration is
    scattered across paper forms, spreadsheets, and WhatsApp groups. Students miss deadlines or double-book, while
    admins have no single view of capacity, attendance, or engagement. AuraEvent centralizes discovery, registration,
    ticketing, and analytics into one portal.`,
  },
  {
    id: 'objectives', label: 'Objectives',
    list: [
      'Provide a single portal where students can discover and register for all campus events.',
      'Enforce capacity, deadline, and duplicate-registration rules automatically.',
      'Generate a verifiable QR entry pass for every successful registration.',
      'Give administrators CRUD control over events, participants, and announcements.',
      'Surface participation trends through live analytics dashboards.',
      'Work fully offline (LocalStorage) for grading, and seamlessly upgrade to Supabase PostgreSQL in production.',
    ],
  },
  {
    id: 'scope', label: 'Scope',
    body: `In scope: student registration/login, event discovery and filtering, registration with business-rule
    validation, QR ticket generation, admin event/participant/announcement management, and analytics.
    Out of scope: payment processing, offline check-in scanning hardware, and multi-college federation — flagged
    as future enhancements.`,
  },
  {
    id: 'srs', label: 'SRS',
    list: [
      'FR-1: Users shall register and authenticate with role-based access (student / admin).',
      'FR-2: Students shall search and filter events by keyword and category.',
      'FR-3: The system shall prevent registration past capacity, past the deadline, or a duplicate entry.',
      'FR-4: The system shall generate an SVG QR pass on successful registration.',
      'FR-5: Admins shall create, edit, delete, and publish events.',
      'FR-6: Admins shall export a participant roster as CSV.',
      'FR-7: Admins shall broadcast prioritized announcements.',
      'NFR-1: The application shall remain usable with zero external services configured (LocalStorage fallback).',
      'NFR-2: All admin routes shall be inaccessible to unauthenticated or non-admin users.',
    ],
  },
  {
    id: 'usecase', label: 'Use Case Diagram',
    diagram: [
      '┌────────────┐        register for event         ┌─────────────┐',
      '│            │ ─────────────────────────────────▶│             │',
      '│  Student   │        view / cancel ticket        │   Events    │',
      '│            │ ◀───────────────────────────────── │   System    │',
      '└────────────┘                                    │             │',
      '                                                   │             │',
      '┌────────────┐   create / edit / delete event      │             │',
      '│            │ ─────────────────────────────────▶│             │',
      '│   Admin    │   view participants / export CSV    │             │',
      '│            │ ─────────────────────────────────▶│             │',
      '└────────────┘   broadcast announcement            └─────────────┘',
    ],
  },
  {
    id: 'context-dfd', label: 'Context DFD',
    diagram: [
      '                 ┌────────────────────┐',
      '   Student  ───▶ │                    │ ───▶  QR Ticket',
      '                 │      AuraEvent      │',
      '   Admin    ───▶ │                    │ ───▶  Analytics / CSV',
      '                 └────────────────────┘',
      '                          │  ▲',
      '                          ▼  │',
      '                 Supabase / LocalStorage',
    ],
  },
  {
    id: 'level1-dfd', label: 'Level 1 DFD',
    diagram: [
      'Student ─▶ [1. Auth] ─▶ [2. Browse Events] ─▶ [3. Register] ─▶ [4. Generate QR]',
      '                                                     │',
      '                                                     ▼',
      '                                          [Registrations Store]',
      '                                                     ▲',
      'Admin ─▶ [5. Manage Events] ─▶ [Events Store]        │',
      '     └─▶ [6. View Participants] ◀────────────────────┘',
      '     └─▶ [7. Analytics Engine]',
    ],
  },
  {
    id: 'er', label: 'ER Diagram',
    diagram: [
      '┌─────────────┐        ┌────────────────┐        ┌────────────┐',
      '│  profiles   │ 1    * │  registrations  │ *    1 │   events   │',
      '│─────────────│───────▶│─────────────────│◀───────│────────────│',
      '│ id (PK)     │        │ id (PK)         │        │ id (PK)    │',
      '│ full_name   │        │ user_id (FK)    │        │ title      │',
      '│ email       │        │ event_id (FK)   │        │ capacity   │',
      '│ role        │        │ status          │        │ deadline   │',
      '└─────────────┘        │ qr_data         │        └────────────┘',
      '                       └─────────────────┘',
      '┌────────────────┐',
      '│ announcements   │',
      '│─────────────────│',
      '│ id (PK), title,  │',
      '│ message, priority│',
      '└──────────────────┘',
    ],
  },
  {
    id: 'class', label: 'Class Diagram',
    diagram: [
      '┌────────────────────┐     ┌─────────────────────┐     ┌────────────────────┐',
      '│ AuthService         │     │ EventService          │     │ RegistrationService  │',
      '│─────────────────────│     │───────────────────────│     │──────────────────────│',
      '│ +signUp()           │     │ +list() / +get()       │     │ +register()           │',
      '│ +signIn()           │     │ +create/update/remove()│     │ +cancel()             │',
      '│ +signOut()          │     │ +seatsTaken()          │     │ +listForUser/Event()  │',
      '└────────────────────┘     └─────────────────────┘     └────────────────────┘',
      '           all three delegate to →  Supabase client  |  LocalStorage mock',
    ],
  },
  {
    id: 'activity', label: 'Activity Diagram',
    diagram: [
      '(Start) ─▶ View Event ─▶ Click Register ─▶ ◇ Deadline passed? ─▶ Yes ─▶ Show error ─▶ (End)',
      '                                   │ No',
      '                                   ▼',
      '                     ◇ Capacity full? ─▶ Yes ─▶ Show error ─▶ (End)',
      '                                   │ No',
      '                                   ▼',
      '                   ◇ Already registered? ─▶ Yes ─▶ Show error ─▶ (End)',
      '                                   │ No',
      '                                   ▼',
      '                        Create Registration ─▶ Generate QR ─▶ (End)',
    ],
  },
  {
    id: 'sequence', label: 'Sequence Diagram',
    diagram: [
      'Student   Browser        RegistrationService     Database',
      '  │  click Register │                │                │',
      '  │ ───────────────▶│  register()    │                │',
      '  │                 │───────────────▶│  validate rules│',
      '  │                 │                │───────────────▶│',
      '  │                 │                │  insert row    │',
      '  │                 │                │◀───────────────│',
      '  │                 │◀───────────────│  registration  │',
      '  │◀────────────────│  render QR pass                 │',
    ],
  },
  {
    id: 'wbs', label: 'WBS',
    list: [
      '1. Requirements & Planning — problem statement, SRS, scope',
      '2. UI/UX Design — dark theme system, component library',
      '3. Frontend Build — routing, layouts, pages',
      '4. Data Layer — Supabase schema, LocalStorage fallback, service abstraction',
      '5. Feature Implementation — registration, QR, admin CRUD, analytics',
      '6. Testing — functional, responsive, security',
      '7. Deployment — GitHub, Vercel, production verification',
      '8. Documentation & Viva Preparation',
    ],
  },
  {
    id: 'gantt', label: 'Gantt Chart',
    diagram: [
      'Week   1  2  3  4  5  6  7  8',
      'Plan   ██',
      'Design    ██ ██',
      'Build        ██ ██ ██',
      'Data            ██ ██',
      'Test                  ██ ██',
      'Deploy                      ██',
      'Docs                        ██ ██',
    ],
  },
  {
    id: 'risk', label: 'Risk Mitigation',
    list: [
      'Risk: Supabase quota/downtime → Mitigation: automatic LocalStorage fallback keeps the app usable.',
      'Risk: Double registration race condition → Mitigation: unique DB constraint on (user_id, event_id) plus client-side check.',
      'Risk: Admin URL guessed by a student → Mitigation: client-side route guard + server-side RLS policies.',
      'Risk: Secrets committed to Git → Mitigation: .env is gitignored; only .env.example is tracked; anon key only, never service-role key.',
      'Risk: SPA deep-link 404s on host → Mitigation: SPA rewrite rule configured for the hosting platform.',
    ],
  },
  {
    id: 'test', label: 'Test Matrix',
    list: [
      'TC-01 Register within capacity → Pass: registration created, seat count decremented.',
      'TC-02 Register after capacity full → Pass: error shown, no row created.',
      'TC-03 Register after deadline → Pass: error shown.',
      'TC-04 Duplicate registration → Pass: error shown, no second row.',
      'TC-05 QR pass renders for a valid registration → Pass.',
      'TC-06 Cancel registration frees a seat → Pass.',
      'TC-07 Non-admin visits /admin/dashboard directly → Redirected to student dashboard.',
      'TC-08 CSV export matches on-screen participant list → Pass.',
      'TC-09 Direct browser load of /docs → Loads without a server 404.',
    ],
  },
]

export default function Docs() {
  const [active, setActive] = useState(SECTIONS[0].id)
  const section = SECTIONS.find(s => s.id === active)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col lg:flex-row gap-6">
      <aside className="lg:w-64 shrink-0">
        <h2 className="flex items-center gap-2 font-display font-semibold text-lg mb-4">
          <FileText className="text-primary-400" size={20} /> SE &amp; PM Docs
        </h2>
        <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`whitespace-nowrap text-left text-sm px-3 py-2 rounded-lg transition-colors shrink-0 ${
                active === s.id ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30' : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </aside>

      <section className="flex-1 glass-panel rounded-2xl p-6 sm:p-8 min-h-[50vh]">
        <h1 className="font-display text-2xl font-semibold mb-5">{section.label}</h1>
        {section.body && <p className="text-slate-300 leading-relaxed whitespace-pre-line">{section.body}</p>}
        {section.list && (
          <ul className="flex flex-col gap-2.5">
            {section.list.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-300">
                <span className="text-primary-400 mt-0.5">▸</span> {item}
              </li>
            ))}
          </ul>
        )}
        {section.diagram && (
          <pre className="bg-slate-950/60 border border-white/10 rounded-xl p-4 text-xs sm:text-sm text-emerald-300 overflow-x-auto leading-relaxed">
            {section.diagram.join('\n')}
          </pre>
        )}
      </section>
    </div>
  )
}

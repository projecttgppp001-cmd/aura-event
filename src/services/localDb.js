// LocalStorage-backed mock database.
// Used automatically when Supabase credentials are not configured, so the
// app is fully functional out of the box for local grading/demo purposes.

const KEYS = {
  users: 'auraevent_users',
  events: 'auraevent_events',
  registrations: 'auraevent_registrations',
  announcements: 'auraevent_announcements',
  session: 'auraevent_session',
}

const uid = () => crypto.randomUUID()

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

const SEED_EVENTS = [
  {
    id: uid(), title: 'TechFest 2026', description: 'A three-day celebration of technology, innovation and student projects across every engineering department.',
    category: 'Technical', image_url: '', event_date: '2026-09-12', start_time: '09:00', end_time: '18:00',
    venue: 'Main Auditorium', organizer: 'CSE Department', capacity: 150, registration_deadline: '2026-09-10',
    prize: '₹25,000', status: 'Registration Open',
  },
  {
    id: uid(), title: 'AI Hackathon', description: '24-hour hackathon focused on building applied AI solutions for real campus problems.',
    category: 'Hackathon', image_url: '', event_date: '2026-09-20', start_time: '10:00', end_time: '10:00',
    venue: 'Innovation Lab', organizer: 'AI/ML Club', capacity: 80, registration_deadline: '2026-09-18',
    prize: '₹50,000', status: 'Registration Open',
  },
  {
    id: uid(), title: 'Code Sprint', description: 'Competitive programming contest with algorithmic problems of increasing difficulty.',
    category: 'Competition', image_url: '', event_date: '2026-09-05', start_time: '14:00', end_time: '17:00',
    venue: 'Computer Lab 3', organizer: 'Coding Club', capacity: 60, registration_deadline: '2026-09-03',
    prize: '₹10,000', status: 'Registration Open',
  },
  {
    id: uid(), title: 'Cultural Night', description: 'An evening of music, dance and drama performances from every department.',
    category: 'Cultural', image_url: '', event_date: '2026-10-02', start_time: '18:00', end_time: '22:00',
    venue: 'Open Air Theatre', organizer: 'Cultural Committee', capacity: 400, registration_deadline: '2026-09-28',
    prize: '', status: 'Registration Open',
  },
  {
    id: uid(), title: 'Web Dev Workshop', description: 'Hands-on workshop covering modern React, Vite and Tailwind CSS fundamentals.',
    category: 'Workshop', image_url: '', event_date: '2026-08-28', start_time: '11:00', end_time: '15:00',
    venue: 'Seminar Hall 2', organizer: 'CSE Department', capacity: 50, registration_deadline: '2026-08-26',
    prize: '', status: 'Registration Open',
  },
  {
    id: uid(), title: 'Inter-College Cricket Cup', description: 'Annual T20 cricket tournament between departments and affiliated colleges.',
    category: 'Sports', image_url: '', event_date: '2026-09-15', start_time: '08:00', end_time: '17:00',
    venue: 'College Sports Ground', organizer: 'Sports Committee', capacity: 200, registration_deadline: '2026-09-12',
    prize: '₹15,000', status: 'Registration Open',
  },
  {
    id: uid(), title: 'Entrepreneurship Seminar', description: 'Talks and panel discussion with alumni founders on building startups after college.',
    category: 'Seminar', image_url: '', event_date: '2026-09-08', start_time: '13:00', end_time: '16:00',
    venue: 'Conference Hall', organizer: 'E-Cell', capacity: 120, registration_deadline: '2026-09-06',
    prize: '', status: 'Registration Open',
  },
  {
    id: uid(), title: 'Robotics Expo', description: 'Showcase of student-built robots with a live obstacle-course competition round.',
    category: 'Technical', image_url: '', event_date: '2026-10-10', start_time: '10:00', end_time: '16:00',
    venue: 'Mechanical Block Yard', organizer: 'Robotics Club', capacity: 90, registration_deadline: '2026-10-07',
    prize: '₹20,000', status: 'Registration Open',
  },
]

function seedIfEmpty() {
  if (!localStorage.getItem(KEYS.events)) write(KEYS.events, SEED_EVENTS)
  if (!localStorage.getItem(KEYS.users)) {
    write(KEYS.users, [
      { id: uid(), full_name: 'Prof. Vikram Sharma', email: 'admin@college.edu', password: 'admin123', role: 'admin', student_id: '', department: 'Administration', year: '' },
      { id: uid(), full_name: 'Pavan', email: 'student@college.edu', password: 'student123', role: 'student', student_id: 'IT2023041', department: 'Information Technology', year: '3rd Year' },
    ])
  }
  // Keep existing local development data aligned after identity updates.
  const users = read(KEYS.users, [])
  const demoStudent = users.find(user => user.email === 'student@college.edu')
  if (demoStudent && (demoStudent.full_name !== 'Pavan' || demoStudent.department !== 'Information Technology')) {
    Object.assign(demoStudent, { full_name: 'Pavan', student_id: 'IT2023041', department: 'Information Technology' })
    write(KEYS.users, users)
  }
  if (!localStorage.getItem(KEYS.registrations)) write(KEYS.registrations, [])
  if (!localStorage.getItem(KEYS.announcements)) {
    write(KEYS.announcements, [
      { id: uid(), title: 'Welcome to AuraEvent', message: 'Registrations for TechFest 2026 are now open. Don\u2019t miss out!', priority: 'Important', created_at: new Date().toISOString() },
      { id: uid(), title: 'Venue Change', message: 'The Cultural Night rehearsal has moved to the Open Air Theatre.', priority: 'Normal', created_at: new Date().toISOString() },
    ])
  }
}
seedIfEmpty()

// ---------- Auth ----------
export const localAuth = {
  signUp({ full_name, email, password, student_id, department, year, role = 'student' }) {
    const users = read(KEYS.users, [])
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists.')
    }
    const user = { id: uid(), full_name, email, password, student_id, department, year, role }
    users.push(user)
    write(KEYS.users, users)
    const { password: _pw, ...safeUser } = user
    write(KEYS.session, safeUser)
    return safeUser
  },
  signIn(email, password) {
    const users = read(KEYS.users, [])
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
    if (!user) throw new Error('Invalid email or password.')
    const { password: _pw, ...safeUser } = user
    write(KEYS.session, safeUser)
    return safeUser
  },
  signOut() {
    localStorage.removeItem(KEYS.session)
  },
  getSession() {
    return read(KEYS.session, null)
  },
}

// ---------- Events ----------
export const localEvents = {
  list() {
    return read(KEYS.events, [])
  },
  get(id) {
    return read(KEYS.events, []).find(e => e.id === id) || null
  },
  create(event) {
    const events = read(KEYS.events, [])
    const newEvent = { id: uid(), status: 'Published', ...event }
    events.unshift(newEvent)
    write(KEYS.events, events)
    return newEvent
  },
  update(id, patch) {
    const events = read(KEYS.events, [])
    const idx = events.findIndex(e => e.id === id)
    if (idx === -1) throw new Error('Event not found.')
    events[idx] = { ...events[idx], ...patch }
    write(KEYS.events, events)
    return events[idx]
  },
  remove(id) {
    write(KEYS.events, read(KEYS.events, []).filter(e => e.id !== id))
  },
  seatsTaken(eventId) {
    return read(KEYS.registrations, []).filter(r => r.event_id === eventId && r.status === 'Registered').length
  },
}

// ---------- Registrations ----------
export const localRegistrations = {
  listForUser(userId) {
    const regs = read(KEYS.registrations, []).filter(r => r.user_id === userId)
    const events = read(KEYS.events, [])
    return regs.map(r => ({ ...r, event: events.find(e => e.id === r.event_id) || null }))
  },
  listForEvent(eventId) {
    const regs = read(KEYS.registrations, []).filter(r => r.event_id === eventId)
    const users = read(KEYS.users, [])
    return regs.map(r => {
      const u = users.find(x => x.id === r.user_id)
      return { ...r, student_name: u?.full_name, student_email: u?.email, department: u?.department, student_id: u?.student_id }
    })
  },
  listAll() {
    const regs = read(KEYS.registrations, [])
    const users = read(KEYS.users, [])
    const events = read(KEYS.events, [])
    return regs.map(r => ({
      ...r,
      student_name: users.find(u => u.id === r.user_id)?.full_name,
      department: users.find(u => u.id === r.user_id)?.department,
      event_title: events.find(e => e.id === r.event_id)?.title,
    }))
  },
  register(userId, eventId) {
    const events = read(KEYS.events, [])
    const event = events.find(e => e.id === eventId)
    if (!event) throw new Error('Event not found.')
    if (!['Published', 'Registration Open'].includes(event.status)) {
      throw new Error('Registration is not open for this event.')
    }

    const regs = read(KEYS.registrations, [])
    if (regs.some(r => r.user_id === userId && r.event_id === eventId && r.status === 'Registered')) {
      throw new Error('You are already registered for this event.')
    }
    if (regs.some(r => r.user_id === userId && r.event_id === eventId && r.status === 'Completed')) {
      throw new Error('A completed registration cannot be reopened.')
    }
    if (new Date(event.registration_deadline) < new Date(new Date().toDateString())) {
      throw new Error('The registration deadline for this event has passed.')
    }
    const seatsTaken = regs.filter(r => r.event_id === eventId && r.status === 'Registered').length
    if (seatsTaken >= event.capacity) {
      throw new Error('This event has reached full capacity.')
    }

    const cancelled = regs.find(r => r.user_id === userId && r.event_id === eventId && r.status === 'Cancelled')
    const registration = {
      id: uid(),
      user_id: userId,
      event_id: eventId,
      registration_date: new Date().toISOString(),
      status: 'Registered',
      qr_data: JSON.stringify({ regId: uid(), userId, eventId, ts: Date.now() }),
    }
    if (cancelled) {
      Object.assign(cancelled, { ...registration, id: cancelled.id })
    } else {
      regs.push(registration)
    }
    write(KEYS.registrations, regs)
    return registration
  },
  cancel(registrationId, userId) {
    const regs = read(KEYS.registrations, [])
    const idx = regs.findIndex(r => r.id === registrationId && r.user_id === userId)
    if (idx === -1) throw new Error('Registration not found.')
    regs[idx].status = 'Cancelled'
    write(KEYS.registrations, regs)
    return regs[idx]
  },
}

// ---------- Announcements ----------
export const localAnnouncements = {
  list() {
    return read(KEYS.announcements, []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  },
  create(data) {
    const list = read(KEYS.announcements, [])
    const item = { id: uid(), created_at: new Date().toISOString(), ...data }
    list.unshift(item)
    write(KEYS.announcements, list)
    return item
  },
  remove(id) {
    write(KEYS.announcements, read(KEYS.announcements, []).filter(a => a.id !== id))
  },
}

// Application Services / Database Abstraction Layer.
//
// Every page/component calls into this module only — never into Supabase
// or localStorage directly. That keeps business rules (capacity, duplicate
// registration, deadlines) consistent no matter which provider is active.

import { supabase, isSupabaseConfigured } from './supabaseClient'
import { localAuth, localEvents, localRegistrations, localAnnouncements } from './localDb'

export const usingSupabase = isSupabaseConfigured

// ---------------- Auth ----------------
export const authService = {
  async signUp({ full_name, email, password, student_id, department, year }) {
    if (usingSupabase) {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name, student_id, department, year } },
      })
      if (error) throw error
      if (!data.user) throw new Error('Account creation did not return a user.')
      return {
        id: data.user.id, full_name, email, student_id, department, year,
        role: 'student', requiresEmailConfirmation: !data.session,
      }
    }
    return localAuth.signUp({ full_name, email, password, student_id, department, year })
  },

  async signIn(email, password) {
    if (usingSupabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      const { data: profile, error: profileError } = await supabase
        .from('profiles').select('*').eq('id', data.user.id).single()
      if (profileError) throw profileError
      return profile
    }
    return localAuth.signIn(email, password)
  },

  async signOut() {
    if (usingSupabase) {
      await supabase.auth.signOut()
      return
    }
    localAuth.signOut()
  },

  async getSession() {
    if (usingSupabase) {
      const { data } = await supabase.auth.getSession()
      if (!data.session) return null
      const { data: profile } = await supabase
        .from('profiles').select('*').eq('id', data.session.user.id).single()
      return profile
    }
    return localAuth.getSession()
  },
}

// ---------------- Events ----------------
export const eventService = {
  async list() {
    if (usingSupabase) {
      const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: true })
      if (error) throw error
      return data
    }
    return localEvents.list()
  },

  async get(id) {
    if (usingSupabase) {
      const { data, error } = await supabase.from('events').select('*').eq('id', id).single()
      if (error) throw error
      return data
    }
    return localEvents.get(id)
  },

  async seatsTaken(eventId) {
    if (usingSupabase) {
      const { data, error } = await supabase.rpc('event_seats_taken', { target_event_id: eventId })
      if (error) throw error
      return data || 0
    }
    return localEvents.seatsTaken(eventId)
  },

  async create(event) {
    if (usingSupabase) {
      const { data, error } = await supabase.from('events').insert(event).select().single()
      if (error) throw error
      return data
    }
    return localEvents.create(event)
  },

  async update(id, patch) {
    if (usingSupabase) {
      const { data, error } = await supabase.from('events').update(patch).eq('id', id).select().single()
      if (error) throw error
      return data
    }
    return localEvents.update(id, patch)
  },

  async remove(id) {
    if (usingSupabase) {
      const { error } = await supabase.from('events').delete().eq('id', id)
      if (error) throw error
      return
    }
    localEvents.remove(id)
  },
}

// ---------------- Registrations ----------------
export const registrationService = {
  async listForUser(userId) {
    if (usingSupabase) {
      const { data, error } = await supabase
        .from('registrations').select('*, event:events(*)')
        .eq('user_id', userId).order('registration_date', { ascending: false })
      if (error) throw error
      return data
    }
    return localRegistrations.listForUser(userId)
  },

  async listForEvent(eventId) {
    if (usingSupabase) {
      const { data, error } = await supabase
        .from('registrations').select('*, profiles(full_name, email, department, student_id)')
        .eq('event_id', eventId)
      if (error) throw error
      return data.map(r => ({
        ...r,
        student_name: r.profiles?.full_name,
        student_email: r.profiles?.email,
        department: r.profiles?.department,
        student_id: r.profiles?.student_id,
      }))
    }
    return localRegistrations.listForEvent(eventId)
  },

  async listAll() {
    if (usingSupabase) {
      const { data, error } = await supabase
        .from('registrations').select('*, profiles(full_name, department), events(title)')
        .order('registration_date', { ascending: false })
      if (error) throw error
      return data.map(r => ({
        ...r,
        student_name: r.profiles?.full_name,
        department: r.profiles?.department,
        event_title: r.events?.title,
      }))
    }
    return localRegistrations.listAll()
  },

  // Business rules (capacity, duplicate, deadline) are enforced identically
  // for both providers so registration behaves the same either way.
  async register(userId, eventId) {
    if (usingSupabase) {
      const event = await eventService.get(eventId)
      if (!event) throw new Error('Event not found.')
      if (!['Published', 'Registration Open'].includes(event.status)) {
        throw new Error('Registration is not open for this event.')
      }
      if (new Date(event.registration_deadline) < new Date(new Date().toDateString())) {
        throw new Error('The registration deadline for this event has passed.')
      }
      const seatsTaken = await eventService.seatsTaken(eventId)
      if (seatsTaken >= event.capacity) throw new Error('This event has reached full capacity.')

      const qr_data = JSON.stringify({ userId, eventId, ts: Date.now() })
      const { data: existing, error: existingError } = await supabase
        .from('registrations').select('id, status').eq('user_id', userId).eq('event_id', eventId).maybeSingle()
      if (existingError) throw existingError
      if (existing?.status === 'Registered') throw new Error('You are already registered for this event.')
      if (existing && existing.status !== 'Cancelled') {
        throw new Error('A completed registration cannot be reopened.')
      }
      if (existing?.status === 'Cancelled') {
        const { data, error } = await supabase
          .from('registrations')
          .update({ status: 'Registered', registration_date: new Date().toISOString(), qr_data })
          .eq('id', existing.id).eq('user_id', userId).select().single()
        if (error) throw error
        return data
      }
      const { data, error } = await supabase
        .from('registrations')
        .insert({ user_id: userId, event_id: eventId, status: 'Registered', qr_data })
        .select().single()
      if (error) {
        if (error.code === '23505') throw new Error('You are already registered for this event.')
        throw error
      }
      return data
    }
    return localRegistrations.register(userId, eventId)
  },

  async cancel(registrationId, userId) {
    if (usingSupabase) {
      const { data, error } = await supabase
        .from('registrations').update({ status: 'Cancelled' })
        .eq('id', registrationId).eq('user_id', userId).eq('status', 'Registered').select().single()
      if (error) throw error
      return data
    }
    return localRegistrations.cancel(registrationId, userId)
  },
}

// ---------------- Announcements ----------------
export const announcementService = {
  async list() {
    if (usingSupabase) {
      const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data
    }
    return localAnnouncements.list()
  },
  async create(payload) {
    if (usingSupabase) {
      const { data, error } = await supabase.from('announcements').insert(payload).select().single()
      if (error) throw error
      return data
    }
    return localAnnouncements.create(payload)
  },
  async remove(id) {
    if (usingSupabase) {
      const { error } = await supabase.from('announcements').delete().eq('id', id)
      if (error) throw error
      return
    }
    localAnnouncements.remove(id)
  },
}

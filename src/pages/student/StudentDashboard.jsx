import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck, Ticket, Megaphone, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/useAuth'
import { eventService, registrationService, announcementService } from '../../services/database'
import EventCard from '../../components/EventCard'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [myRegs, setMyRegs] = useState([])
  const [announcements, setAnnouncements] = useState([])

  useEffect(() => {
    eventService.list().then(setEvents)
    registrationService.listForUser(user.id).then(regs => setMyRegs(regs.filter(r => r.status === 'Registered')))
    announcementService.list().then(list => setAnnouncements(list.slice(0, 2)))
  }, [user.id])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl font-semibold mb-1">Welcome back, {user.full_name?.split(' ')[0]} 👋</h1>
      <p className="text-slate-400 mb-8">{user.department} · {user.year}</p>

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary-600/20"><Ticket className="text-primary-400" size={22} /></div>
          <div><p className="text-2xl font-semibold">{myRegs.length}</p><p className="text-sm text-slate-400">Active Tickets</p></div>
        </div>
        <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-600/20"><CalendarCheck className="text-emerald-400" size={22} /></div>
          <div><p className="text-2xl font-semibold">{events.filter(event => ['Published', 'Registration Open'].includes(event.status) && new Date(event.registration_deadline) >= new Date(new Date().toDateString())).length}</p><p className="text-sm text-slate-400">Events Open</p></div>
        </div>
        <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-600/20"><Megaphone className="text-amber-400" size={22} /></div>
          <div><p className="text-2xl font-semibold">{announcements.length}</p><p className="text-sm text-slate-400">New Announcements</p></div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-semibold">Recommended Events</h2>
        <Link to="/student/events" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">Browse all <ArrowRight size={14} /></Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {events.slice(0, 3).map(e => <EventCard key={e.id} event={e} />)}
      </div>
    </div>
  )
}

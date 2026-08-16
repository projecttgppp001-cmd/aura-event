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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 route-enter">
      <p className="eyebrow mb-2"><span className="status-dot" /> Student command</p>
      <h1 className="danger-title text-3xl sm:text-4xl mb-2">Welcome back, <span className="danger-gradient-text">{user.full_name?.split(' ')[0]}.</span></h1>
      <p className="text-slate-500 mb-8">{user.department} · {user.year}</p>

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary-600/20"><Ticket className="text-primary-400" size={22} /></div>
          <div><p className="danger-number text-2xl font-bold">{myRegs.length}</p><p className="text-sm text-slate-500">Active Tickets</p></div>
        </div>
        <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-600/20"><CalendarCheck className="text-emerald-400" size={22} /></div>
          <div><p className="danger-number text-2xl font-bold">{events.filter(event => ['Published', 'Registration Open'].includes(event.status) && new Date(event.registration_deadline) >= new Date(new Date().toDateString())).length}</p><p className="text-sm text-slate-500">Events Open</p></div>
        </div>
        <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-600/20"><Megaphone className="text-amber-400" size={22} /></div>
          <div><p className="danger-number text-2xl font-bold">{announcements.length}</p><p className="text-sm text-slate-500">New Announcements</p></div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold">Recommended operations</h2>
        <Link to="/student/events" className="danger-outline rounded-lg px-3 py-2 text-sm flex items-center gap-1">Browse all <ArrowRight size={14} /></Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {events.slice(0, 3).map(e => <EventCard key={e.id} event={e} />)}
      </div>
    </div>
  )
}

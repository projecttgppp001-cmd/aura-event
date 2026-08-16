import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Users, Megaphone, TrendingUp, Plus } from 'lucide-react'
import { eventService, registrationService, announcementService, usingSupabase } from '../../services/database'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ events: 0, registrations: 0, announcements: 0 })
  const [recentEvents, setRecentEvents] = useState([])

  useEffect(() => {
    Promise.all([eventService.list(), registrationService.listAll(), announcementService.list()]).then(
      ([events, regs, anns]) => {
        setStats({ events: events.length, registrations: regs.filter(r => r.status === 'Registered').length, announcements: anns.length })
        setRecentEvents(events.slice(0, 5))
      }
    )
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-2xl font-semibold">Admin Dashboard</h1>
        <span className={`text-xs px-2.5 py-1 rounded-full border ${usingSupabase ? 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10' : 'border-amber-500/30 text-amber-300 bg-amber-500/10'}`}>
          {usingSupabase ? 'Supabase PostgreSQL' : 'Local Mock Mode'}
        </span>
      </div>
      <p className="text-slate-400 mb-8">Overview of AuraEvent activity</p>

      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        <StatCard icon={CalendarDays} color="primary" label="Total Events" value={stats.events} />
        <StatCard icon={Users} color="emerald" label="Active Registrations" value={stats.registrations} />
        <StatCard icon={Megaphone} color="amber" label="Announcements" value={stats.announcements} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-semibold flex items-center gap-2"><TrendingUp size={18} className="text-primary-400" /> Recent Events</h2>
        <Link to="/admin/events/new" className="flex items-center gap-1.5 text-sm bg-primary-600 hover:bg-primary-500 px-4 py-2 rounded-lg font-medium">
          <Plus size={15} /> New Event
        </Link>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500 border-b border-white/5">
            <tr><th className="px-5 py-3 font-medium">Title</th><th className="px-5 py-3 font-medium">Category</th><th className="px-5 py-3 font-medium">Date</th><th className="px-5 py-3 font-medium">Status</th></tr>
          </thead>
          <tbody>
            {recentEvents.map(e => (
              <tr key={e.id} className="border-b border-white/5 last:border-0">
                <td className="px-5 py-3">{e.title}</td>
                <td className="px-5 py-3 text-slate-400">{e.category}</td>
                <td className="px-5 py-3 text-slate-400">{new Date(e.event_date).toLocaleDateString('en-IN')}</td>
                <td className="px-5 py-3 text-slate-400">{e.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, color, label, value }) {
  const colors = { primary: 'bg-primary-600/20 text-primary-400', emerald: 'bg-emerald-600/20 text-emerald-400', amber: 'bg-amber-600/20 text-amber-400' }
  return (
    <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${colors[color]}`}><Icon size={22} /></div>
      <div><p className="text-2xl font-semibold">{value}</p><p className="text-sm text-slate-400">{label}</p></div>
    </div>
  )
}

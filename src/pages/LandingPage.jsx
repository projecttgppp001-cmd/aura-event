import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, QrCode, BarChart3, ShieldCheck, ArrowRight, Mail, Code2, CalendarDays, Users } from 'lucide-react'
import { eventService } from '../services/database'
import { useAuth } from '../context/useAuth'
import EventCard from '../components/EventCard'

const FEATURES = [
  { id: '01', icon: QrCode, title: 'Weapon-grade entry', desc: 'Instant, scannable QR passes. Zero queues. Zero paper. No weak links.' },
  { id: '02', icon: ShieldCheck, title: 'Rules that hit first', desc: 'Capacity, deadline and duplicate checks execute before chaos reaches the door.' },
  { id: '03', icon: BarChart3, title: 'Command the crowd', desc: 'Live participation intelligence gives organizers a clean tactical advantage.' },
]

export default function LandingPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])

  useEffect(() => {
    eventService.list().then(list => setEvents(list.slice(0, 3)))
  }, [])

  const commandPath = user
    ? (user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard')
    : '/register'

  return (
    <div className="flex-1 route-enter">
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 danger-grid opacity-60" />
        <div className="absolute -top-40 -right-28 size-[36rem] rounded-full bg-primary-600/10 blur-[120px]" />
        <div className="absolute right-[-3rem] top-12 font-display font-black text-[26vw] leading-none text-white/[0.018] select-none">AURA</div>

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-24 lg:py-28 grid lg:grid-cols-[1.08fr_.92fr] gap-12 lg:gap-16 items-center">
          <div>
            <span className="eyebrow mb-7"><span className="status-dot" /> System online · campus control</span>
            <h1 className="danger-title text-5xl sm:text-6xl md:text-7xl xl:text-[5.8rem] max-w-4xl">
              Own the night.<br />
              <span className="danger-gradient-text">Run the campus.</span>
            </h1>
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mt-7 leading-relaxed">
              One ruthless command center for event discovery, registrations, QR access and live operations. Built for campuses that refuse to look ordinary.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-9">
              <Link to={commandPath} className="danger-button px-6 py-3.5 rounded-lg font-bold flex items-center justify-center gap-2 uppercase tracking-[.08em] text-sm">
                {user ? 'Enter command center' : 'Activate access'} <ArrowRight size={17} />
              </Link>
              <Link to="/student/events" className="danger-outline px-6 py-3.5 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm">
                Browse live events <CalendarDays size={17} />
              </Link>
            </div>

            <div className="grid grid-cols-3 max-w-xl mt-11 border-y border-white/10 divide-x divide-white/10">
              {[
                [events.length || '—', 'Priority events'],
                ['< 10s', 'Registration'],
                ['24/7', 'Command uptime'],
              ].map(([value, label]) => (
                <div key={label} className="py-4 px-3 first:pl-0">
                  <p className="danger-number text-xl sm:text-2xl font-bold text-white">{value}</p>
                  <p className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-500 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel scanline rounded-2xl p-1 border-primary-500/20 shadow-[0_0_100px_rgba(225,29,72,.12)]">
            <div className="rounded-[.85rem] border border-white/5 bg-black/40 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
                <div>
                  <p className="eyebrow"><span className="status-dot" /> Live operations</p>
                  <p className="font-display font-bold mt-1">Priority event feed</p>
                </div>
                <span className="danger-number text-[10px] text-slate-500 border border-white/10 rounded px-2 py-1">AURA_OS 2.6</span>
              </div>

              <div className="p-3 sm:p-4 space-y-2">
                {events.length ? events.map((event, index) => (
                  <Link key={event.id} to={`/student/events/${event.id}`} className="group flex items-center gap-4 p-3.5 rounded-xl border border-white/7 hover:border-primary-500/40 hover:bg-primary-500/[.06] transition-colors">
                    <span className="danger-number text-xs text-primary-400">0{index + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold truncate group-hover:text-primary-300 transition-colors">{event.title}</p>
                      <p className="text-xs text-slate-500 truncate mt-1">{event.venue} · {event.category}</p>
                    </div>
                    <ArrowRight size={16} className="text-slate-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
                  </Link>
                )) : (
                  <div className="h-56 flex items-center justify-center text-sm text-slate-500">Initializing event feed…</div>
                )}
              </div>

              <div className="grid grid-cols-2 border-t border-white/8 divide-x divide-white/8">
                <div className="p-4 flex items-center gap-3"><Users size={17} className="text-primary-400" /><div><p className="text-xs text-slate-500">ACCESS</p><p className="text-sm font-semibold">Role secured</p></div></div>
                <div className="p-4 flex items-center gap-3"><Sparkles size={17} className="text-orange-400" /><div><p className="text-xs text-slate-500">STATUS</p><p className="text-sm font-semibold">No friction</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
          <div>
            <span className="eyebrow">Built different</span>
            <h2 className="danger-title text-4xl sm:text-5xl mt-3">Control without compromise.</h2>
          </div>
          <p className="text-slate-500 max-w-md text-sm leading-relaxed">Every feature is designed to remove operational noise and keep the experience fast, visible and impossible to ignore.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {FEATURES.map(({ id, icon: Icon, title, desc }) => (
            <article key={id} className="glass-card rounded-2xl p-6 sm:p-7 min-h-64 flex flex-col">
              <div className="flex items-start justify-between">
                <div className="size-11 rounded-lg bg-primary-500/10 border border-primary-500/25 flex items-center justify-center"><Icon className="text-primary-400" size={21} /></div>
                <span className="danger-number text-xs text-slate-600">/{id}</span>
              </div>
              <h3 className="font-display text-xl font-bold mt-auto mb-3">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      {events.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-24">
          <div className="flex items-end justify-between gap-4 mb-7">
            <div><span className="eyebrow">Targets acquired</span><h2 className="danger-title text-3xl sm:text-4xl mt-2">Upcoming operations.</h2></div>
            <Link to="/student/events" className="danger-outline rounded-lg px-4 py-2.5 text-sm hidden sm:flex items-center gap-2">View all <ArrowRight size={15} /></Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map(e => <EventCard key={e.id} event={e} linkTo={`/student/events/${e.id}`} />)}
          </div>
          <Link to="/student/events" className="danger-outline rounded-lg px-4 py-3 text-sm mt-5 sm:hidden flex items-center justify-center gap-2">View all events <ArrowRight size={15} /></Link>
        </section>
      )}

      <footer className="border-t border-white/8 bg-black/30">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p><span className="text-white font-display font-bold">AURA<span className="text-primary-500">//EVENT</span></span> · © {new Date().getFullYear()}</p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <a href="mailto:projecttgppp001@gmail.com" className="hover:text-primary-300 transition-colors flex items-center gap-1.5"><Mail size={15} /> projecttgppp001@gmail.com</a>
            <a href="https://github.com/projecttgppp001-cmd" target="_blank" rel="noreferrer" className="hover:text-primary-300 transition-colors flex items-center gap-1.5"><Code2 size={15} /> projecttgppp001-cmd</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

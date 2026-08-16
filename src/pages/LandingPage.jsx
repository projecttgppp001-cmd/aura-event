import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, QrCode, BarChart3, ShieldCheck, ArrowRight, Mail, Code2 } from 'lucide-react'
import { eventService } from '../services/database'
import EventCard from '../components/EventCard'

export default function LandingPage() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    eventService.list().then(list => setEvents(list.slice(0, 3)))
  }, [])

  return (
    <div className="flex-1">
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full glass-panel text-primary-300 mb-6">
          <Sparkles size={13} /> College Event Management, reimagined
        </span>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-5">
          Every Event on Campus.<br className="hidden sm:block" /> <span className="text-primary-400">One Portal.</span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto mb-8">
          Discover hackathons, workshops, and fests — register in seconds, get an instant QR pass, and let admins manage it all from one dashboard.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/register" className="bg-primary-600 hover:bg-primary-500 px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors">
            Get Started <ArrowRight size={16} />
          </Link>
          <Link to="/student/events" className="glass-card px-6 py-3 rounded-xl font-medium">Browse Events</Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 grid sm:grid-cols-3 gap-5 pb-16">
        {[
          { icon: QrCode, title: 'Instant QR Tickets', desc: 'Every registration generates a printable SVG entry pass, instantly.' },
          { icon: ShieldCheck, title: 'Smart Registration Rules', desc: 'Capacity limits, deadlines, and duplicate-entry checks enforced automatically.' },
          { icon: BarChart3, title: 'Live Admin Analytics', desc: 'Category breakdowns, timelines and participation trends at a glance.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="glass-card rounded-2xl p-6">
            <Icon className="text-primary-400 mb-3" size={26} />
            <h3 className="font-semibold mb-1.5">{title}</h3>
            <p className="text-sm text-slate-400">{desc}</p>
          </div>
        ))}
      </section>

      {events.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-24">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-2xl font-semibold">Upcoming Events</h2>
            <Link to="/student/events" className="text-sm text-primary-400 hover:text-primary-300">View all →</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map(e => <EventCard key={e.id} event={e} linkTo={`/student/events/${e.id}`} />)}
          </div>
        </section>
      )}

      <footer className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <p>© {new Date().getFullYear()} AuraEvent</p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <a href="mailto:projecttgppp001@gmail.com" className="hover:text-primary-300 transition-colors flex items-center gap-1.5">
              <Mail size={15} /> projecttgppp001@gmail.com
            </a>
            <a href="https://github.com/projecttgppp001-cmd" target="_blank" rel="noreferrer" className="hover:text-primary-300 transition-colors flex items-center gap-1.5">
              <Code2 size={15} /> projecttgppp001-cmd
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

import React from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, MapPin, Users, Tag, ArrowUpRight } from 'lucide-react'

const CATEGORY_COLORS = {
  Technical: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  Cultural: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
  Sports: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Workshop: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  Seminar: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  Hackathon: 'bg-primary-500/15 text-primary-300 border-primary-500/30',
  Competition: 'bg-red-500/15 text-red-300 border-red-500/30',
  Other: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
}

export default function EventCard({ event, seatsTaken = 0, linkTo }) {
  const remaining = Math.max(event.capacity - seatsTaken, 0)
  const isFull = remaining === 0
  const deadlinePassed = new Date(event.registration_deadline) < new Date(new Date().toDateString())
  const registrationUnavailable = !['Published', 'Registration Open'].includes(event.status)

  return (
    <Link to={linkTo || `/student/events/${event.id}`} className="glass-card rounded-2xl p-5 sm:p-6 flex flex-col gap-3 group min-h-80" aria-label={`View ${event.title}`}>
      <div className="flex items-start justify-between gap-2">
        <span className={`text-[10px] uppercase tracking-[.12em] font-semibold px-2.5 py-1.5 rounded-md border ${CATEGORY_COLORS[event.category] || CATEGORY_COLORS.Other}`}>
          <Tag size={11} className="inline -mt-0.5 mr-1" />{event.category}
        </span>
        {(isFull || deadlinePassed || registrationUnavailable) && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-700/50 text-slate-400 border border-slate-600/50">
            {isFull ? 'Full' : 'Closed'}
          </span>
        )}
      </div>

      <div className="flex items-start justify-between gap-3 mt-2">
        <h3 className="font-display font-bold text-xl text-white group-hover:text-primary-300 transition-colors leading-tight">{event.title}</h3>
        <span className="size-8 shrink-0 rounded-lg border border-white/10 flex items-center justify-center text-slate-500 group-hover:text-white group-hover:border-primary-500/40 group-hover:bg-primary-500/10 transition-all"><ArrowUpRight size={15} /></span>
      </div>
      <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{event.description}</p>

      <div className="mt-auto pt-4 border-t border-white/8 grid grid-cols-2 gap-3 text-xs text-slate-400">
        <span className="flex items-center gap-1.5"><CalendarDays size={13} className="text-primary-400" /> {new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
        <span className="flex items-center gap-1.5 min-w-0"><MapPin size={13} className="text-primary-400 shrink-0" /> <span className="truncate">{event.venue}</span></span>
        <span className="col-span-2 flex items-center gap-1.5"><Users size={13} className="text-primary-400" /> <span className="danger-number">{remaining}</span> / {event.capacity} seats left</span>
      </div>
    </Link>
  )
}

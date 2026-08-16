import React from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, MapPin, Users, Tag } from 'lucide-react'

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
    <Link to={linkTo || `/student/events/${event.id}`} className="glass-card rounded-2xl p-5 flex flex-col gap-3 group">
      <div className="flex items-start justify-between gap-2">
        <span className={`text-xs px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[event.category] || CATEGORY_COLORS.Other}`}>
          <Tag size={11} className="inline -mt-0.5 mr-1" />{event.category}
        </span>
        {(isFull || deadlinePassed || registrationUnavailable) && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-700/50 text-slate-400 border border-slate-600/50">
            {isFull ? 'Full' : 'Closed'}
          </span>
        )}
      </div>

      <h3 className="font-display font-semibold text-lg text-white group-hover:text-primary-300 transition-colors">{event.title}</h3>
      <p className="text-sm text-slate-400 line-clamp-2">{event.description}</p>

      <div className="mt-auto pt-3 border-t border-white/5 flex flex-col gap-1.5 text-xs text-slate-400">
        <span className="flex items-center gap-1.5"><CalendarDays size={13} /> {new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        <span className="flex items-center gap-1.5"><MapPin size={13} /> {event.venue}</span>
        <span className="flex items-center gap-1.5"><Users size={13} /> {remaining} / {event.capacity} seats left</span>
      </div>
    </Link>
  )
}

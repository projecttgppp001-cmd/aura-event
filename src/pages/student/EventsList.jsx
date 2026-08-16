import React, { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { eventService } from '../../services/database'
import EventCard from '../../components/EventCard'

const CATEGORIES = ['All', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Hackathon', 'Competition', 'Other']

export default function EventsList() {
  const [events, setEvents] = useState([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('date')

  useEffect(() => {
    eventService.list().then(setEvents)
  }, [])

  const filtered = useMemo(() => {
    let list = events.filter(e =>
      (category === 'All' || e.category === category) &&
      (e.title.toLowerCase().includes(query.toLowerCase()) || e.description.toLowerCase().includes(query.toLowerCase()))
    )
    if (sort === 'date') list = [...list].sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
    if (sort === 'recent') list = [...list].reverse()
    return list
  }, [events, query, category, sort])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display text-2xl font-semibold mb-6">Explore Events</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 bg-slate-800/60 border border-white/10 rounded-lg px-3 py-2.5 flex-1">
          <Search size={16} className="text-slate-500" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search events…" className="bg-transparent outline-none flex-1 text-sm text-slate-100" />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)} className="bg-slate-800/60 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-100">
          {CATEGORIES.map(c => <option key={c} value={c} className="bg-slate-800">{c}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} className="bg-slate-800/60 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-100">
          <option value="date" className="bg-slate-800">Sort: Upcoming date</option>
          <option value="recent" className="bg-slate-800">Sort: Recently added</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-slate-500 text-center py-16">No events match your search.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(e => <EventCard key={e.id} event={e} />)}
        </div>
      )}
    </div>
  )
}
